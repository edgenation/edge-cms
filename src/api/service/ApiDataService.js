var Promise = require("bluebird"),
    _ = require("lodash"),
    mongoose = require("mongoose"),
    sanitize = require("mongo-sanitize");

function modelHasProperty(Model, property) {
    return Model.schema.paths[property];
}

var ApiDataService = {};

ApiDataService.isValidId = function(id) {
    return mongoose.Types.ObjectId.isValid(id);
};

ApiDataService.updateAttributesFromBody = function (req) {
    return function (data) {
        _.forEach(req.body.data.attributes, function (value, prop) {
            data[prop] = sanitize(value);
        });

        return data;
    };
};

ApiDataService.ensureDataReturned = function (data) {
    if (!data) {
        throw null;
    }

    return data;
};

ApiDataService.selectQuery = function (query, req) {
    // GET /articles?include=author&fields[articles]=title,body&fields[people]=name HTTP/1.1
    var fields = sanitize(req.query.fields);
    var includes = sanitize(req.query.include);

    // TODO: Fix sparse fieldsets
    // TODO: Verify this includes behaviour
    if (fields) {
        // Force includes if used
        if (includes) {
            fields += "," + includes;
        }
        query.select(fields.replace(/,/g, " "));
    }
};

ApiDataService.whereQuery = function (query, req) {
    // GET /comments?filter[post]=1,2&filter[author]=12
    var filter = sanitize(req.query.filter);
    if (filter) {
        query.where(filter);
    }
};

ApiDataService.paginateQuery = function (query, offset, limit) {
    // TODO: Validate offset >= 0
    return query.skip(offset).limit(limit);
};

ApiDataService.sortQuery = function (query, req) {
    var sort = sanitize(req.query.sort);
    if (sort) {
        query.sort(sort.replace(/,/g, " "));
    }
};

ApiDataService.wrapInProperty = function (propertyName) {
    return function (data) {
        var res = {};
        res[propertyName] = data;
        return res;
    };
};

ApiDataService.getReferencedModelNameByPath = function (Model, path) {
    if (!modelHasProperty(Model, path)) {
        return false;
    }

    if (Array.isArray(Model.schema.paths[path].options.type)) {
        return Model.schema.paths[path].options.type[0].ref
    } else {
        return Model.schema.paths[path].options.ref;
    }
};

ApiDataService.getModelFromName = function (Model, name) {
    return Model.db.model(name);
};


ApiDataService.getReferencedModelByPath = function (Model, path) {
    var referenceModelName = ApiDataService.getReferencedModelNameByPath(Model, path);
    return ApiDataService.getModelFromName(Model, referenceModelName);
};

ApiDataService.getIncludedDataFor = function(Model, linkedProperty, response, location) {
    location = location || "data";
    var LinkedModel = ApiDataService.getReferencedModelByPath(Model, linkedProperty);

    var linkedIds = [];
    if (Array.isArray(response[location])) {
        _.forEach(response[location], function(d) {
            linkedIds = linkedIds.concat(d[linkedProperty]);
        });
        _.uniq(linkedIds, "id");
    } else {
        linkedIds = response[location][linkedProperty];
    }

    var query = LinkedModel.find({ "_id": { $in: linkedIds } });
    return Promise.promisify(query.exec, query)()
        .then(ApiDataService.ensureDataReturned)
        .then(function(linkedData) {
            if (!response.included) {
                response.included = [];
            }

            response.included = response.included.concat(linkedData);
            return response;
        });
};


function generateNestedInclude(includedProperty) {
    var include = {};

    includedProperty = includedProperty.split(".");

    if (includedProperty.length === 1) {
        include[includedProperty[0]] = true;
    } else if (includedProperty.length === 2) {
        include[includedProperty[0]] = {};
        include[includedProperty[0]][includedProperty[1]] = true;
    } else {
        include[includedProperty[0]] = {};
        include[includedProperty[0]][includedProperty[1]] = {};
        include[includedProperty[0]][includedProperty[1]][includedProperty[2]] = true;
    }

    return include;
}


ApiDataService.addIncludedData = function(Model, req) {
    var includes = sanitize(req.query.include);
    if (!includes) {
        return _.identity;
    }

    var nestedIncludes = {};

    // Generated object representing includes
    _.forEach(includes.split(","), function (includedProperty) {
        nestedIncludes = _.merge(nestedIncludes, generateNestedInclude(includedProperty));
    });

    // Remove includes that do not exist on the schema
    _.forEach(nestedIncludes, function (n, linkedProperty) {
        if (!modelHasProperty(Model, linkedProperty)) {
            delete(nestedIncludes[linkedProperty])
        }
    });


    // Process the includes
    return function (response) {
        var funcs = [];

        _.forEach(nestedIncludes, function (nestedIncludes2, linkedProperty1) {
            var Model1 = Model;

            // Single includes
            funcs.push(function (response) {
                return ApiDataService.getIncludedDataFor(Model1, linkedProperty1, response);
            });

            // Check second level
            if (_.isObject(nestedIncludes2)) {
                _.forEach(nestedIncludes2, function (nestedIncludes3, linkedProperty2) {
                    var Model2 = ApiDataService.getReferencedModelByPath(Model1, linkedProperty1);
                    if (!modelHasProperty(Model2, linkedProperty2)) {
                        return;
                    }

                    funcs.push(function (response) {
                        return ApiDataService.getIncludedDataFor(Model2, linkedProperty2, response, "included");
                    });

                    // Check third level
                    if (_.isObject(nestedIncludes3)) {
                        _.forEach(nestedIncludes3, function (nestedIncludes4, linkedProperty3) {
                            var Model3 = ApiDataService.getReferencedModelByPath(Model2, linkedProperty2);
                            if (!modelHasProperty(Model3, linkedProperty3)) {
                                return;
                            }

                            funcs.push(function (response) {
                                return ApiDataService.getIncludedDataFor(Model3, linkedProperty3, response, "included");
                            });
                        });
                    }
                });
            }
        });

        return funcs.reduce(function (soFar, f) {
            return soFar.then(f);
        }, Promise.resolve(response));
    };
};


ApiDataService.addPaginationData = function (Model, offset, limit, originalQuery) {
    originalQuery = originalQuery || {};

    return function (response) {
        return Promise.promisify(Model.count, Model)(originalQuery).then(function (count) {
            if (!response.meta) {
                response.meta = {};
            }

            if (!response.links) {
                response.links = {};
            }

            response.meta.page = {
                offset: offset,
                limit: limit,
                total: count
            };

            // TODO: Add the links
            response.links.first = null;
            response.links.last = null;
            response.links.prev = null;
            response.links.next = null;

            if (offset - limit >= 0) {
                // TODO: Add the href
                response.links.prev = offset - limit;
            }

            if (offset + limit < response.meta.page.count) {
                // TODO: Add the href
                response.links.next = offset + limit;
            }

            return response;
        });
    };
};


ApiDataService.list = function (req, Model, defaultPageSize) {
    var query = Model.find();
    var limit = parseInt(req.query.limit, 10) || defaultPageSize;
    var offset = parseInt(req.query.offset, 10) || 0;

    ApiDataService.whereQuery(query, req);
    ApiDataService.sortQuery(query, req);
    ApiDataService.selectQuery(query, req);

    var originalQuery = query.getQuery();

   ApiDataService.paginateQuery(query, offset, limit);

    return Promise.promisify(query.exec, query)()
        .then(ApiDataService.ensureDataReturned)
        .then(ApiDataService.wrapInProperty("data"))
        .then(ApiDataService.addIncludedData(Model, req))
        .then(ApiDataService.addPaginationData(Model, offset, limit, originalQuery));
};

ApiDataService.create = function (req, Model) {
    // TODO: sanitize
    var model = new Model(req.body.data.attributes);

    return Promise.promisify(model.save, model)()
        .spread(ApiDataService.ensureDataReturned)
        .then(ApiDataService.wrapInProperty("data"));
};

ApiDataService.details = function (req, Model) {
    var query = Model.findOne({_id: sanitize(req.params.id)});

    ApiDataService.selectQuery(query, req);

    return Promise.promisify(query.exec, query)()
        .then(ApiDataService.ensureDataReturned)
        .then(ApiDataService.wrapInProperty("data"))
        .then(ApiDataService.addIncludedData(Model, req));
};

ApiDataService.update = function (req, Model) {
    return Promise.promisify(Model.findOne, Model)({ _id: sanitize(req.params.id) })
        .then(ApiDataService.ensureDataReturned)
        .then(ApiDataService.updateAttributesFromBody(req))
        .then(function (model) {
            return Promise.promisify(model.save, model)()
                .spread(ApiDataService.ensureDataReturned)
                .then(ApiDataService.wrapInProperty("data"));
        });
};

ApiDataService.remove = function (req, Model) {
    return Promise.promisify(Model.findByIdAndRemove, Model)(sanitize(req.params.id))
        .then(ApiDataService.ensureDataReturned)
        .then(ApiDataService.wrapInProperty("data"));
};


ApiDataService.includesList = function (req, Model, defaultPageSize) {
    var relationshipProperty = req.params.relationship;
    var limit = parseInt(req.query.limit, 10) || defaultPageSize;
    var offset = parseInt(sanitize(req.query.offset), 10) || 0;

    var query = Model.findOne({_id: sanitize(req.params.id)});

    //var RelationshipModel = require("../../model/region");

    return Promise.promisify(query.exec, query)()
        .then(ApiDataService.ensureDataReturned)
        .then(function (data) {

            return Promise.promisify(Model.populate, Model)(data, {
                path: relationshipProperty,
                options: {
                    limit: limit,
                    skip: offset
                }
            });
        })
        //.then(ApiDataService.addIncludedData(Model, req))
        //.then(ApiDataService.addIncludedData(RelationshipModel, req))
        .then(function (data) {
            return data[relationshipProperty];
        })
        .then(ApiDataService.wrapInProperty("data"));
        // Would have to do a second lookup to count the matching records
        //var originalQuery = query.getQuery();
        //.then(ApiDataService.addPaginationData(Model, offset, limit, originalQuery));
};

// TODO: Should use ```data: {}```
// TODO: Change to accept an array?
ApiDataService.includesAdd = function(req, Model) {
    // TODO: Validate the body?
    var relationshipProperty = req.params.relationship;

    return Promise.promisify(Model.findOne, Model)({ _id: sanitize(req.params.id) })
        .then(ApiDataService.ensureDataReturned)
        .then(function(model) {
            // Check the item is not already in the collection
            if (model[relationshipProperty].indexOf(req.body[relationshipProperty]) === -1) {
                model[relationshipProperty].push(req.body[relationshipProperty]);
            }

            // TODO: DO NOT SAVE NULL! IT CAUSES ERRORS!
            return Promise.promisify(model.save, model)()
                .spread(ApiDataService.ensureDataReturned)
                .then(ApiDataService.wrapInProperty("data"));
        });
};

// TODO: Should use ```data: {}```
// TODO: Change to accept an array?
ApiDataService.includesRemove = function(req, Model) {
    // TODO: Validate the body?
    var relationshipProperty = req.params.relationship;

    return Promise.promisify(Model.findOne, Model)({ _id: sanitize(req.params.id) })
        .then(ApiDataService.ensureDataReturned)
        .then(function(model) {
            model[relationshipProperty].pull(req.body[relationshipProperty]);

            return Promise.promisify(model.save, model)()
                .spread(ApiDataService.ensureDataReturned)
                .then(ApiDataService.wrapInProperty("data"));
        });
};


module.exports = ApiDataService;
