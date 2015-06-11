var Q = require("q"),
    _ = require("lodash"),
    mongoose = require("mongoose");

var ApiDataService = {};

ApiDataService.isValidId = function(id) {
    return mongoose.Types.ObjectId.isValid(id);
};

ApiDataService.updateAttributesFromBody = function (req) {
    return function (data) {
        _.forEach(req.body.data.attributes, function (value, prop) {
            data[prop] = value;
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
    var fields = req.query.fields;
    var includes = req.query.include;

    if (fields) {
        // Force includes if used
        if (includes) {
            fields += "," + includes;
        }
        query.select(fields.replace(/,/g, " "));
    }
};

ApiDataService.paginateQuery = function (query, req, limit) {
    var offset = req.query.offset;
    // TODO: Validate offset >= 0
    offset = parseInt(offset, 10) || 0;
    query.skip(offset);
    query.limit(limit);
    return offset;
};

ApiDataService.sortQuery = function (query, req) {
    var sort = req.query.sort;
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
    if (!Model.schema.paths[path]) {
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

ApiDataService.getIncludedDataFor = function(Model, linkedProperty, response, location) {
    location = location || "data";
    var linkedModelName = ApiDataService.getReferencedModelNameByPath(Model, linkedProperty);
    var LinkedModel = ApiDataService.getModelFromName(Model, linkedModelName);

    var linkedIds = [];
    if (Array.isArray(response[location])) {
        _.forEach(response[location], function(d) {
            linkedIds = linkedIds.concat(d[linkedProperty]);
        });
        _.uniq(linkedIds, "id");
    } else {
        linkedIds = response[location][linkedProperty];
    }

    var linkedQuery = LinkedModel.find({ "_id": { $in: linkedIds } });
    return Q(linkedQuery.exec())
        .then(ApiDataService.ensureDataReturned)
        .then(function(linkedData) {
            if (!response.included) {
                response.included = [];
            }

            response.included = response.included.concat(linkedData);
            return response;
        });
};

ApiDataService.addIncludedData = function(Model, req) {
    var includes = req.query.include;
    if (!includes) {
        return Q.resolve();
    }

    includes = includes.split(",");

    var nestedIncludes = _.remove(includes, function(linkedProperty) {
        return (linkedProperty.indexOf(".") !== -1);
    });

    // TODO: Ensure nested also includes parent!
    // E.g. include=containers.content
    // This should infer include=containers,containers.content


    // Process the includes
    return function(response) {
        var funcs = [];

        // Single includes
        _.forEach(includes, function(linkedProperty) {
            // No such nested property
            if (!Model.schema.paths[linkedProperty]) {
                return;
            }

            var func = function(response) {
                return ApiDataService.getIncludedDataFor(Model, linkedProperty, response);
            };

            funcs.push(func);
        });

        // Nested includes that include a . - e.g. containers.content
        _.forEach(nestedIncludes, function(linkedPropertyObj) {
            linkedPropertyObj = linkedPropertyObj.split(".");

            // Ensure only one level deep!
            if (linkedPropertyObj.length !== 2) {
                return;
            }

            var parentProperty = linkedPropertyObj[0];
            var nestedProperty = linkedPropertyObj[1];

            // No such nested property
            if (!Model.schema.paths[parentProperty]) {
                return;
            }

            var func = function(response) {
                // If there is no included data to parse
                if (!response.included || response.included.length === 0) {
                    return response;
                }

                var parentModelName = ApiDataService.getReferencedModelNameByPath(Model, parentProperty);
                var ParentModel = ApiDataService.getModelFromName(Model, parentModelName);

                // No such deep nested property
                if (!ParentModel.schema.paths[nestedProperty]) {
                    return response;
                }

                return ApiDataService.getIncludedDataFor(ParentModel, nestedProperty, response, "included");
            };

            funcs.push(func);
        });


        return funcs.reduce(Q.when, Q(response));
    };
};


ApiDataService.addPaginationData = function (Model, offset, limit) {
    return function (response) {
        return Q.ninvoke(Model, "count").then(function (count) {
            if (!response.meta) {
                response.meta = {};
            }
            if (!response.links) {
                response.links = {};
            }

            response.meta.page = {
                ofsset: offset,
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


ApiDataService.list = function (req, Model, pageSize) {
    var listQuery = Model.find();

    var page = ApiDataService.paginateQuery(listQuery, req, pageSize);
    ApiDataService.sortQuery(listQuery, req);
    ApiDataService.selectQuery(listQuery, req);

    return Q(listQuery.exec())
        .then(ApiDataService.ensureDataReturned)
        .then(ApiDataService.wrapInProperty("data"))
        .then(ApiDataService.addIncludedData(Model, req))
        .then(ApiDataService.addPaginationData(Model, page, pageSize));
};

ApiDataService.create = function (req, Model) {
    var model = new Model(req.body.data.attributes);

    return Q.ninvoke(model, "save")
        .spread(ApiDataService.ensureDataReturned)
        .then(ApiDataService.wrapInProperty("data"));
};

ApiDataService.details = function (req, Model) {
    var detailQuery = Model.findOne({_id: req.params.id});

    ApiDataService.selectQuery(detailQuery, req);

    return Q(detailQuery.exec())
        .then(ApiDataService.ensureDataReturned)
        .then(ApiDataService.wrapInProperty("data"))
        .then(ApiDataService.addIncludedData(Model, req));
};

ApiDataService.update = function (req, Model) {
    return Q.ninvoke(Model, "findOne", {_id: req.params.id})
        .then(ApiDataService.ensureDataReturned)
        .then(ApiDataService.updateAttributesFromBody(req))
        .then(function (model) {
            return Q.ninvoke(model, "save")
                .spread(ApiDataService.ensureDataReturned)
                .then(ApiDataService.wrapInProperty("data"));
        });
};

ApiDataService.remove = function (req, Model) {
    return Q.ninvoke(Model, "findByIdAndRemove", req.params.id)
        .then(ApiDataService.ensureDataReturned)
        .then(ApiDataService.wrapInProperty("data"));
};


ApiDataService.includesList = function (req, Model) {
    var relationshipProperty = req.params.relationship;

    var query = Model.findOne({_id: req.params.id});

    //var RelationshipModel = require("../../model/content-container");

    return Q(query.exec())
        .then(ApiDataService.ensureDataReturned)
        .then(function (data) {
            return Q.ninvoke(Model, "populate", data, {path: relationshipProperty});
        })
        //.then(ApiDataService.addIncludedData(Model, req))
        //.then(ApiDataService.addIncludedData(RelationshipModel, req))
        .then(function (data) {
            return data[relationshipProperty];
        })
        .then(ApiDataService.wrapInProperty("data"));
};

ApiDataService.includesAdd = function(req, Model) {
    // TODO: Validate the body?
    var relationshipProperty = req.params.relationship;

    return Q.ninvoke(Model, "findOne", { _id: req.params.id })
        .then(ApiDataService.ensureDataReturned)
        .then(function(model) {
            // Check the item is not already in the collection
            if (model[relationshipProperty].indexOf(req.body[relationshipProperty]) === -1) {
                model[relationshipProperty].push(req.body[relationshipProperty]);
            }

            return Q.ninvoke(model, "save")
                .spread(ApiDataService.ensureDataReturned)
                .then(ApiDataService.wrapInProperty("data"));
        });
};

ApiDataService.includesRemove = function(req, Model) {
    // TODO: Validate the body?
    var relationshipProperty = req.params.relationship;

    return Q.ninvoke(Model, "findOne", { _id: req.params.id })
        .then(ApiDataService.ensureDataReturned)
        .then(function(model) {
            model[relationshipProperty].pull(req.body[relationshipProperty]);

            return Q.ninvoke(model, "save")
                .spread(ApiDataService.ensureDataReturned)
                .then(ApiDataService.wrapInProperty("data"));
        });
};


module.exports = ApiDataService;
