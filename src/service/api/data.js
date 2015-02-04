var mongoose = require("mongoose"),
    Q = require("q"),
    _ = require("lodash"),
    pluralize = require("pluralize");

var ApiDataService = {};


ApiDataService.updateProps = function (req, property) {
    return function (data) {
        _.forEach(req.body[property], function (value, prop) {
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

ApiDataService.paginateQuery = function (query, req, pageSize) {
    var page = req.query.page;
    // TODO: Validate page >= 1
    page = parseInt(page, 10) || 1;
    query.skip(pageSize * (page - 1));
    query.limit(pageSize);
    return page;
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

ApiDataService.getModelNameFromProperty = function (Model, property) {
    if (!Model.schema.paths[property]) {
        return false;
    }

    // TODO: Check type is always array
    return Model.schema.paths[property].options.type[0].ref;
};

ApiDataService.getModelFromName = function (Model, name) {
    return Model.db.model(name);
};


ApiDataService.addLinkedData = function (propertyName, Model, req) {
    var includes = req.query.include;
    if (!includes) {
        return Q.resolve();
    }

    return function (data) {
        var promises = [];

        includes = includes.split(",");

        _.forEach(includes, function (linkedProperty) {
            // TODO: Nested includes that include a . - e.g. containers.content
            //if (linkedProperty.indexOf(".") !== -1) {
            //    return;
            //}

            // TODO: Validate the linkedProperty is part of the model!
            if (!Model.schema.paths[linkedProperty]) {
                return;
            }

            var linkedModelName = ApiDataService.getModelNameFromProperty(Model, linkedProperty);
            var LinkedModel = ApiDataService.getModelFromName(Model, linkedModelName);

            var linkedIds = [];
            if (Array.isArray(data[propertyName])) {
                _.forEach(data[propertyName], function (d) {
                    linkedIds = linkedIds.concat(d[linkedProperty]);
                });
                _.uniq(linkedIds, "id");
            } else {
                linkedIds = data[propertyName][linkedProperty];
            }

            var linkedQuery = LinkedModel.find({"_id": {$in: linkedIds}});
            promises.push(
                Q.ninvoke(linkedQuery, "exec")
                    .then(ApiDataService.ensureDataReturned)
                    .then(function (linkedData) {
                        if (!data.linked) {
                            data.linked = {};
                        }

                        data.linked[linkedProperty] = linkedData;
                        return data;
                    })
            );
        });

        if (promises.length === 1) {
            return promises[0];
        } else {
            return promises.reduce(Q.when, Q(data));
        }
    };
};

ApiDataService.addMetaData = function (Model, property, page, pageSize) {
    return function (data) {
        return Q.ninvoke(Model, "count").then(function (count) {
            if (!data.meta) {
                data.meta = {};
            }

            data.meta[property] = {
                page: page,
                pageSize: pageSize,
                count: count,
                pageCount: Math.ceil(count / pageSize),
                previousPage: null,
                nextPage: null,
                previousHref: null,
                nextHref: null
            };

            if (page > 1) {
                data.meta[property].previousPage = page - 1;
                // TODO: Add the href
                data.meta[property].previousHref = "";
            }

            if (page < data.meta[property].pageCount) {
                data.meta[property].nextPage = page + 1;
                // TODO: Add the href
                data.meta[property].nextHref = "";
            }

            return data;
        });
    };
};


ApiDataService.list = function (req, Model, property, pageSize) {
    var listQuery = Model.find();

    var page = ApiDataService.paginateQuery(listQuery, req, pageSize);
    ApiDataService.sortQuery(listQuery, req);
    ApiDataService.selectQuery(listQuery, req);

    return Q.ninvoke(listQuery, "exec")
        .then(ApiDataService.ensureDataReturned)
        .then(ApiDataService.wrapInProperty(property))
        .then(ApiDataService.addLinkedData(property, Model, req))
        .then(ApiDataService.addMetaData(Model, property, page, pageSize));
};

ApiDataService.create = function (req, Model, property) {
    var model = new Model(req.body[property]);

    return Q.ninvoke(model, "save")
        .spread(ApiDataService.ensureDataReturned)
        .then(ApiDataService.wrapInProperty(property));
};

ApiDataService.details = function (req, Model, property) {
    var detailQuery = Model.findOne({_id: req.params.id});

    ApiDataService.selectQuery(detailQuery, req);

    return Q.ninvoke(detailQuery, "exec")
        .then(ApiDataService.ensureDataReturned)
        .then(ApiDataService.wrapInProperty(property))
        .then(ApiDataService.addLinkedData(property, Model, req));
};

ApiDataService.update = function (req, Model, property) {
    return Q.ninvoke(Model, "findOne", {_id: req.params.id})
        .then(ApiDataService.ensureDataReturned)
        .then(ApiDataService.updateProps(req, property))
        .then(function (model) {
            return Q.ninvoke(model, "save")
                .spread(ApiDataService.ensureDataReturned)
                .then(ApiDataService.wrapInProperty(property));
        });
};

ApiDataService.remove = function (req, Model, property) {
    return Q.ninvoke(Model, "findByIdAndRemove", req.params.id)
        .then(ApiDataService.ensureDataReturned)
        .then(ApiDataService.wrapInProperty(property));
};


ApiDataService.listLinks = function (req, Model) {
    var linkedProperty = req.params.link;

    var query = Model.findOne({_id: req.params.id});

    //var LinkedModel = require("../../model/content-container");

    return Q.ninvoke(query, "exec")
        .then(ApiDataService.ensureDataReturned)
        .then(function (data) {
            return Q.ninvoke(Model, "populate", data, {path: linkedProperty});
        })
        //.then(ApiDataService.addLinkedData("page", Model, req))
        //.then(ApiDataService.addLinkedData("content", LinkedModel, req))
        .then(function (data) {
            return data[linkedProperty];
        })
        .then(ApiDataService.wrapInProperty(linkedProperty));
};


module.exports = ApiDataService;
