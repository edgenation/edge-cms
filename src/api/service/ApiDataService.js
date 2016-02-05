"use strict";

const Promise = require("bluebird"),
    _ = require("lodash"),
    mongoose = require("mongoose"),
    sanitize = require("mongo-sanitize");

/**
 * Regular expression to match all commas
 * @type {RegExp}
 */
const REGEX_COMMAS = /,/g;


/**
 * Check if a model has a given property
 *
 * @param {Object} Model
 * @param {string} property
 * @returns {boolean}
 */
function modelHasProperty(Model, property) {
    return !!Model.schema.paths[property];
}


/** @namespace */
var ApiDataService = {};


/**
 * Check if a mongodb id is valid
 *
 * @param {string|number} id - A mongodb id
 * @returns {boolean}
 */
ApiDataService.isValidId = function(id) {
    return mongoose.Types.ObjectId.isValid(id);
};


/**
 * @param {Object} req - The HTTP request
 * @returns {Function}
 */
ApiDataService.updateAttributesFromBody = function (req) {
    return function (data) {
        _.forEach(req.body.data.attributes, function (value, prop) {
            data[prop] = sanitize(value);
        });

        return data;
    };
};


/**
 * Checks that some data has been returned
 *
 * @throws {null} If the data does not exist
 * @param {Object} data - The data to check
 * @returns {Object} The data
 */
ApiDataService.ensureDataReturned = function (data) {
    if (!data) {
        throw null;
    }

    return data;
};


/**
 * @param {Object} query - The mongoose query
 * @param {Object} req - The HTTP request
 */
ApiDataService.selectQuery = function (query, req) {
    // GET /articles?include=author&fields[articles]=title,body&fields[people]=name HTTP/1.1
    let fields = sanitize(req.query.fields);
    let includes = sanitize(req.query.include);

    // TODO: Fix sparse fieldsets
    // TODO: Verify this includes behaviour
    if (fields) {
        // Force includes if used
        if (includes) {
            fields += "," + includes;
        }
        query.select(fields.replace(REGEX_COMMAS, " "));
    }
};


/**
 * @param {string} str
 * @returns {boolean|RegExp}
 */
ApiDataService.filterStrToRegex = function (str) {
    let len = str.length;
    let firstChar = str[0];
    let lastChar = str[len - 1];

    // TODO: Sanitize the regex input!
    if (firstChar !== "*" && lastChar === "*") {
        return new RegExp("^" + str.substr(0, len - 1));
    } else if (firstChar === "*" && lastChar !== "*") {
        return new RegExp(str.substr(1) + "$");
    } else if (firstChar === "*" && lastChar === "*") {
        return new RegExp(str.substr(1, len - 1));
    }

    return false;
};


/**
 * @param {string} str
 * @returns {boolean|RegExp}
 */
ApiDataService.excludeStrToRegex = function (str) {
    let len = str.length;
    let firstChar = str[0];
    let lastChar = str[len - 1];

    // TODO: Sanitize the regex input!
    if (firstChar !== "*" && lastChar === "*") {
        return new RegExp("^(?!" + str.substr(0, len - 1) + ")");
    } else if (firstChar === "*" && lastChar !== "*") {
        return new RegExp("^(?:(?!" + str.substr(1) + "$).)*$");
    } else if (firstChar === "*" && lastChar === "*") {
        return new RegExp("^(?:(?!^" + str.substr(1, len - 1) + "$).)*$");
    }

    return false;
};


/**
 * @param {Object} query - The mongoose query
 * @param {Object} req - The HTTP request
 */
ApiDataService.whereQuery = function (query, req) {
    // GET /comments?filter[post]=1,2&filter[author]=12
    let filter = sanitize(req.query.filter);
    if (filter) {
        for (let field in filter) {
            if (filter.hasOwnProperty(field)) {
                let regex = ApiDataService.filterStrToRegex(filter[field]);
                if (regex) {
                    query.where(field, regex);
                } else {
                    query.where(field, filter[field]);
                }
            }
        }
    }

    let excludes = sanitize(req.query.exclude);
    if (excludes) {
        for (let field in excludes) {
            if (excludes.hasOwnProperty(field)) {
                let regex = ApiDataService.excludeStrToRegex(excludes[field]);
                if (regex) {
                    query.where(field, regex);
                } else {
                    query.where(field).ne(excludes[field]);
                }
            }
        }
    }
};


/**
 * @param {Object} query - The mongoose query
 * @param {number} offset
 * @param {number} limit
 * @returns {Object} The new query
 */
ApiDataService.paginateQuery = function (query, offset, limit) {
    // TODO: Validate offset >= 0
    return query.skip(offset).limit(limit);
};


/**
 * @param {Object} req - The HTTP request
 * @returns {boolean|string}
 */
ApiDataService.getSort = function (req) {
    let sort = sanitize(req.query.sort);

    if (!sort) {
        return false;
    }

    return sort.replace(REGEX_COMMAS, " ");
};


/**
 * @param {Object} query - The mongoose query
 * @param {Object} req - The HTTP request
 */
ApiDataService.sortQuery = function (query, req) {
    let sort = this.getSort(req);
    if (sort) {
        query.sort(sort);
    }
};


/**
 * @param {string} propertyName
 * @returns {Function}
 */
ApiDataService.wrapInProperty = function (propertyName) {
    return function (data) {
        let res = {};
        res[propertyName] = data;
        return res;
    };
};


/**
 * @param {Object} Model
 * @param {string} path
 * @returns {boolean|string}
 */
ApiDataService.getReferencedModelNameByPath = function (Model, path) {
    if (!modelHasProperty(Model, path)) {
        return false;
    }

    if (Array.isArray(Model.schema.paths[path].options.type)) {
        return Model.schema.paths[path].options.type[0].ref;
    }

    return Model.schema.paths[path].options.ref;
};


/**
 * @param {Object} Model
 * @param {string} name
 * @returns {Object}
 */
ApiDataService.getModelFromName = function (Model, name) {
    return Model.db.model(name);
};


/**
 * @param {Object} Model
 * @param {string} path
 * @returns {Object}
 */
ApiDataService.getReferencedModelByPath = function (Model, path) {
    var referenceModelName = ApiDataService.getReferencedModelNameByPath(Model, path);
    return ApiDataService.getModelFromName(Model, referenceModelName);
};


/**
 * @param {Object} Model
 * @param {string} linkedProperty
 * @param {Object} response - The JSON response
 * @param {string} location
 * @returns {Promise.<T>}
 */
ApiDataService.getIncludedDataFor = function(Model, linkedProperty, response, location) {
    location = location || "data";
    let LinkedModel = ApiDataService.getReferencedModelByPath(Model, linkedProperty);

    let linkedIds = [];
    if (Array.isArray(response[location])) {
        _.forEach(response[location], function(d) {
            linkedIds = linkedIds.concat(d[linkedProperty]);
        });
        _.uniq(linkedIds, "id");
    } else {
        linkedIds = response[location][linkedProperty];
    }

    let query = LinkedModel.find({ "_id": { $in: linkedIds } });
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


/**
 * @param {string} includedProperty
 * @returns {Object}
 */
function generateNestedInclude(includedProperty) {
    let include = {};

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


/**
 * @param {object} Model
 * @param {Object} req - The HTTP request
 * @returns {Function}
 */
ApiDataService.addIncludedData = function(Model, req) {
    let includes = sanitize(req.query.include);
    if (!includes) {
        return value => value;
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
        let funcs = [];

        _.forEach(nestedIncludes, function (nestedIncludes2, linkedProperty1) {
            let Model1 = Model;

            // Single includes
            funcs.push(response => ApiDataService.getIncludedDataFor(Model1, linkedProperty1, response));

            // Check second level
            if (_.isObject(nestedIncludes2)) {
                _.forEach(nestedIncludes2, function (nestedIncludes3, linkedProperty2) {
                    let Model2 = ApiDataService.getReferencedModelByPath(Model1, linkedProperty1);
                    if (!modelHasProperty(Model2, linkedProperty2)) {
                        return;
                    }

                    funcs.push(response => ApiDataService.getIncludedDataFor(Model2, linkedProperty2, response, "included"));

                    // Check third level
                    if (_.isObject(nestedIncludes3)) {
                        _.forEach(nestedIncludes3, function (nestedIncludes4, linkedProperty3) {
                            let Model3 = ApiDataService.getReferencedModelByPath(Model2, linkedProperty2);
                            if (!modelHasProperty(Model3, linkedProperty3)) {
                                return;
                            }

                            funcs.push(response => ApiDataService.getIncludedDataFor(Model3, linkedProperty3, response, "included"));
                        });
                    }
                });
            }
        });

        return funcs.reduce((soFar, f) => soFar.then(f), Promise.resolve(response));
    };
};


/**
 *
 * @param {Object} response - The JSON response
 * @param {number} offset
 * @param {number} limit
 * @param {number} total
 * @returns {Object} The JSON response
 */
ApiDataService.addPaginationData = function (response, offset, limit, total) {
    if (!response.meta) {
        response.meta = {};
    }

    if (!response.links) {
        response.links = {};
    }

    response.meta.page = { offset, limit, total };

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
};


/**
 *
 * @param {Object} Model
 * @param {number} offset
 * @param {number} limit
 * @param {Object} [originalQuery={}]
 * @returns {Function}
 */
ApiDataService.getPaginationData = function (Model, offset, limit, originalQuery) {
    originalQuery = originalQuery || {};

    return function (response) {
        return Promise.promisify(Model.count, Model)(originalQuery).then(function (count) {
            return ApiDataService.addPaginationData(response, offset, limit, count);
        });
    };
};


/**
 * @param {Object} req - The HTTP request
 * @param {Object} Model
 * @param {number} defaultPageSize
 * @returns {Promise.<T>}
 */
ApiDataService.list = function (req, Model, defaultPageSize) {
    let query = Model.find();
    let limit = parseInt(req.query.limit, 10) || defaultPageSize;
    let offset = parseInt(req.query.offset, 10) || 0;

    ApiDataService.whereQuery(query, req);
    ApiDataService.sortQuery(query, req);
    ApiDataService.selectQuery(query, req);

    let originalQuery = query.getQuery();

   ApiDataService.paginateQuery(query, offset, limit);

    return Promise.promisify(query.exec, query)()
        .then(ApiDataService.ensureDataReturned)
        .then(ApiDataService.wrapInProperty("data"))
        .then(ApiDataService.addIncludedData(Model, req))
        .then(ApiDataService.getPaginationData(Model, offset, limit, originalQuery));
};


/**
 * @param {Object} req - The HTTP request
 * @param {Object} Model
 * @returns {Promise.<T>}
 */
ApiDataService.create = function (req, Model) {
    // TODO: sanitize
    let model = new Model(req.body.data.attributes);

    return Promise.promisify(model.save, model)()
        .spread(ApiDataService.ensureDataReturned)
        .then(ApiDataService.wrapInProperty("data"));
};


/**
 * @param {Object} req - The HTTP request
 * @param {Object} Model
 * @returns {Promise.<T>}
 */
ApiDataService.details = function (req, Model) {
    let query = Model.findOne({_id: sanitize(req.params.id)});

    ApiDataService.selectQuery(query, req);

    return Promise.promisify(query.exec, query)()
        .then(ApiDataService.ensureDataReturned)
        .then(ApiDataService.wrapInProperty("data"))
        .then(ApiDataService.addIncludedData(Model, req));
};


/**
 * @param {Object} req - The HTTP request
 * @param {Object} Model
 * @returns {Promise.<T>}
 */
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


/**
 * @param {Object} req - The HTTP request
 * @param {Object} Model
 * @returns {Promise.<T>}
 */
ApiDataService.remove = function (req, Model) {
    return Promise.promisify(Model.findByIdAndRemove, Model)(sanitize(req.params.id))
        .then(ApiDataService.ensureDataReturned)
        .then(ApiDataService.wrapInProperty("data"));
};


/**
 * @param {Object} req - The HTTP request
 * @param {Object} Model
 * @param {number} defaultPageSize
 * @returns {Promise.<T>}
 */
ApiDataService.includesList = function (req, Model, defaultPageSize) {
    let relationshipProperty = req.params.relationship;
    let limit = parseInt(req.query.limit, 10) || defaultPageSize;
    let skip = parseInt(sanitize(req.query.offset), 10) || 0;

    let query = Model.findOne({_id: sanitize(req.params.id)});
    let total = 0;

    var RelationshipModel = ApiDataService.getReferencedModelByPath(Model, relationshipProperty);

    return Promise.promisify(query.exec, query)()
        .then(ApiDataService.ensureDataReturned)
        .then(function (data) {
            // Store the total
            total = data[relationshipProperty].length;

            let options = { limit, skip };
            let sort = ApiDataService.getSort(req);
            if (sort) {
                options.sort = sort;
            }

            return Promise.promisify(Model.populate, Model)(data, {
                path: relationshipProperty,
                options
            });
        })
        .then(function (data) {
            return data[relationshipProperty];
        })
        .then(ApiDataService.wrapInProperty("data"))
        .then(ApiDataService.addIncludedData(RelationshipModel, req))
        .then(function (response) {
            return ApiDataService.addPaginationData(response, skip, limit, total);
        });
};


/**
 * @param {Object} req - The HTTP request
 * @param {Object} Model
 * @returns {Promise.<T>}
 */
ApiDataService.includesAdd = function(req, Model) {
    // TODO: Should use ```data: {}```
    // TODO: Change to accept an array?

    // TODO: Validate the body?
    let relationshipProperty = req.params.relationship;

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


/**
 * @param {Object} req - The HTTP request
 * @param {Object} Model
 * @returns {Promise.<T>}
 */
ApiDataService.includesRemove = function(req, Model) {
    // TODO: Should use ```data: {}```
    // TODO: Change to accept an array?
    // TODO: Validate the body?
    let relationshipProperty = req.params.relationship;

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
