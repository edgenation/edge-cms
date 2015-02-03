var Q = require("q"),
    _ = require("lodash"),
    pluralize = require("pluralize");

var ApiController = require("./index"),
    ContentContainer = require("../../model/content-container"),
    Page = require("../../model/page");


ApiController.ensureDataReturned = function (data) {
    return ApiController.checkDataReturned(data);
};

ApiController.selectQuery = function (query, req) {
    var fields = req.query.fields;
    var includes = req.query.include;

    if (fields) {
        // Force includes if used
        if (includes) {
            fields += "," + includes
        }
        query.select(fields.replace(/,/g, " "));
    }
};

ApiController.paginateQuery = function (query, req, pageSize) {
    var page = req.query.page;
    // TODO: Validate page >= 1
    page = parseInt(page, 10) || 1;
    query.skip(pageSize * (page - 1));
    query.limit(pageSize);
    return page;
};

ApiController.sortQuery = function (query, req) {
    var sort = req.query.sort;
    if (sort) {
        query.sort(sort.replace(/,/g, " "));
    }
};

ApiController.usePropertyNameForData = function (propertyName) {
    return function (data) {
        var res = {};
        res[propertyName] = data;
        return res;
    };
};

ApiController.addLinkedData = function (propertyName, Model, req) {
    var includes = req.query.include;
    if (!includes) {
        return Q.resolve();
    }

    return function (data) {
        var promises = [];

        includes = includes.split(",");

        _.forEach(includes, function (linkedProperty) {
            // TODO: Validate the linkedProperty is part of the model!
            // TODO: Check type is always array
            var linkedModelName = Model.schema.paths[linkedProperty].options.type[0].ref;
            var LinkedModel = Model.db.model(linkedModelName);

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
                    .then(ApiController.ensureDataReturned)
                    .then(function (linkedData) {
                        if (!data.linked) {
                            data.linked = {};
                        }

                        data.linked[linkedProperty] = linkedData;
                        return data;
                    })
            );
        });

        if (promises.length == 1) {
            return promises[0];
        } else {
            return promises.reduce(Q.when, Q(data));
        }
    };
};

ApiController.addMetaData = function (Model, property, page, pageSize) {
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


ApiController.list = function (Model, property, pageSize) {
    return function (req, res, next) {
        var listQuery = Model.find();

        var page = ApiController.paginateQuery(listQuery, req, pageSize);
        ApiController.sortQuery(listQuery, req);
        ApiController.selectQuery(listQuery, req);

        Q.ninvoke(listQuery, "exec")
            .then(ApiController.ensureDataReturned)
            .then(ApiController.usePropertyNameForData(property))
            .then(ApiController.addLinkedData(property, Model, req))
            .then(ApiController.addMetaData(Model, property, page, pageSize))
            .then(ApiController.sendResponse(res, 200))
            .fail(next);
    };
};

ApiController.create = function (Model, property) {
    return function (req, res, next) {
        var model = new Model(req.body[property]);

        Q.ninvoke(model, "save")
            .spread(ApiController.ensureDataReturned)
            .then(ApiController.usePropertyNameForData(property))
            .then(function (data) {
                res.setHeader("Location", "/api/" + property + "/" + data[property].id);
                return data;
            })
            .then(ApiController.sendResponse(res, 201))
            .fail(next);
    };
};

ApiController.details = function (Model, property) {
    return function (req, res, next) {
        var detailQuery = Model.findOne({_id: req.params.id});

        ApiController.selectQuery(detailQuery, req);

        Q.ninvoke(detailQuery, "exec")
            .then(ApiController.ensureDataReturned)
            .then(ApiController.usePropertyNameForData(property))
            .then(ApiController.addLinkedData(property, Model, req))
            .then(ApiController.sendResponse(res, 200))
            .fail(next);
    };
};

ApiController.restForModel = function (Model, perPage) {
    perPage = perPage || 2;
    var singularProperty = Model.modelName;
    var pluralProperty = pluralize(singularProperty);

    return {
        list: ApiController.list(Model, pluralProperty, perPage),
        create: ApiController.create(Model, singularProperty),
        details: ApiController.details(Model, singularProperty)
    }
};


// http://jsonapi.org/format/
//var PageController = ApiController.restForModel(Page, 2);
var PageController = {
    list: ApiController.list(Page, "pages", 2),
    create: ApiController.create(Page, "page"),
    details: ApiController.details(Page, "page"),

    update: function (req, res, next) {},

    remove: function (req, res, next) {},

    links: function (req, res, next) {
        // Show linked data?

        // /links/<relationship-name>
        // GET: /page/1/links/containers
        // PUT: /page/1/links/containers > update relationship
    },


    listContainers: function (req, res, next) {},
    addToContainers: function (req, res, next) {},
    removeFromContainers: function (req, res, next) {}
/*
    update: function (req, res, next) {
        Q.ninvoke(Page, "findOne", {_id: req.params.id})
            .then(ApiController.checkDataReturned)
            .then(ApiController.updateProps(req))
            .then(function (model) {
                // Save the page
                Q.ninvoke(model, "save")
                    .spread(ApiController.checkDataReturned)
                    .then(ApiController.sendResponse(res, 201))
                    .fail(next);
            }).fail(next);
    },

    remove: function (req, res, next) {
        Q.ninvoke(Page, "findByIdAndRemove", req.params.id)
            .then(ApiController.sendResponse(res, 200))
            .fail(next);
    },

    listContainers: function (req, res, next) {
        var query = Page.findOne({_id: req.params.id}).populate("containers");

        Q.ninvoke(query, "exec")
            .then(ApiController.checkDataReturned)
            .then(function (page) {
                Q.ninvoke(ContentContainer, "populate", page.containers, {path: "content"})
                    .then(function (containers) {
                        ApiController.sendResponse(res, 200)(containers);
                    })
                    .fail(next);
            })
            .fail(next);
    },

    addToContainers: function (req, res, next) {
        Q.ninvoke(Page, "findOne", {_id: req.params.id})
            .then(ApiController.checkDataReturned)
            .then(function (page) {
                // Look for the object we are adding
                Q.ninvoke(ContentContainer, "findOne", {_id: req.params.iid})
                    .then(ApiController.checkDataReturned)
                    .then(function (model) {
                        var val = _.find(page.containers, function (item) {
                            return item._id.equals(model._id);
                        });

                        if (val) {
                            // Already there...
                            ApiController.sendResponse(res, 201)(page);
                        } else {
                            // Add the model to the collection
                            page.containers.addToSet(model);

                            // Save the collection
                            Q.ninvoke(page, "save")
                                .spread(ApiController.checkDataReturned)
                                .then(ApiController.sendResponse(res, 201))
                                .fail(next);
                        }
                    })
                    .fail(next);
            })
            .fail(next);
    },

    removeFromContainers: function (req, res, next) {
        Q.ninvoke(Page, "findOne", {_id: req.params.id})
            .then(ApiController.checkDataReturned)
            .then(function (page) {
                // Remove the item
                page.containers.pull(req.params.iid);

                // Save the page
                Q.ninvoke(page, "save")
                    .spread(ApiController.checkDataReturned)
                    .then(ApiController.sendResponse(res, 201))
                    .fail(next);
            })
            .fail(next);
    }
    */
};

module.exports = PageController;

