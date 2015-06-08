var mongoose = require("mongoose"),
    _ = require("lodash"),
    pluralize = require("pluralize");

var ApiDataService = require("../../service/api/data");

var ApiController = {};

ApiController.sendResponse = function (res, status) {
    status = status || 200;

    return function (data) {
        res.status(status).json(data);
    };
};


ApiController.checkDataReturned = function (data) {
    if (!data) {
        throw null;
    }

    return data;
};


// Router middleware to validate :id
ApiController.validateId = function (req, res, next, id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        var err = new Error("Invalid ID");
        err.status = 400;
        return next(err);
    }

    next();
};


// Router level 404 handler
ApiController.error404 = function (req, res, next) {
    var err = new Error("Not Found");
    err.status = 404;
    next(err);
};


// Router level error handler
ApiController.error500 = function (err, req, res, next) {
    if (err.name === "ValidationError") {
        err.status = 400;
    }

    var error = {
        status: err.status ? err.status : 500,
        error: err.message
    };

    if (err.errors) {
        error.errors = err.errors;
    }

    // Only add stack traces in development
    if (process.env.NODE_ENV === "development") {
        if (error.status === 500 && err.stack) {
            error.stack = err.stack;
        }
    }

    if (error.status !== 404) {
        console.error(err.stack);
    }

    // http://jsonapi.org/format/#errors
    //var error = {
    //    id: "",
    //    links: {},
    //    status: 200,
    //    code: "",
    //    title: "",
    //    detail: "",
    //    source: {
    //        pointer: "",
    //        parameter: ""
    //    },
    //    meta: {}
    //};

    res.status(error.status).json(error);
};


ApiController.list = function (Model, property, pageSize) {
    return function (req, res, next) {
        ApiDataService.list(req, Model, property, pageSize)
            .then(ApiController.sendResponse(res, 200))
            .fail(next);
    };
};

ApiController.create = function (Model, property) {
    return function (req, res, next) {
        ApiDataService.create(req, Model, property)
            .then(function (data) {
                // TODO: Use current URL to generate new one
                res.setHeader("Location", "/api/" + property + "/" + data[property].id);
                return data;
            })
            .then(ApiController.sendResponse(res, 201))
            .fail(next);
    };
};

ApiController.details = function (Model, property) {
    return function (req, res, next) {
        ApiDataService.details(req, Model, property)
            .then(ApiController.sendResponse(res, 200))
            .fail(next);
    };
};

ApiController.update = function (Model, property) {
    return function (req, res, next) {
        ApiDataService.update(req, Model, property)
            .then(ApiController.sendResponse(res, 200))
            .fail(next);
    };
};

ApiController.remove = function (Model, property) {
    return function (req, res, next) {
        ApiDataService.update(req, Model, property)
            .then(ApiController.sendResponse(res, 204))
            .fail(next);
    };
};

ApiController.linksList = function (Model) {
    return function (req, res, next) {
        ApiDataService.linksList(req, Model)
            .then(ApiController.sendResponse(res, 200))
            .fail(next);
    };
};

ApiController.linksAdd = function (Model) {
    return function (req, res, next) {
        ApiDataService.linksAdd(req, Model)
            .then(ApiController.sendResponse(res, 200))
            .fail(next);
    };
};

ApiController.linksRemove = function (Model) {
    return function (req, res, next) {
        ApiDataService.linksRemove(req, Model)
            .then(ApiController.sendResponse(res, 200))
            .fail(next);
    };
};

ApiController.restForModel = function (Model, perPage) {
    perPage = perPage || 2;
    var singularProperty = Model.modelName.substr(0, 1).toLowerCase() + Model.modelName.substr(1);
    var pluralProperty = pluralize(singularProperty);

    return {
        list: ApiController.list(Model, pluralProperty, perPage),
        create: ApiController.create(Model, singularProperty),
        details: ApiController.details(Model, singularProperty),
        update: ApiController.update(Model, singularProperty),
        remove: ApiController.remove(Model, singularProperty),
        linksList: ApiController.linksList(Model),
        linksAdd: ApiController.linksAdd(Model),
        linksRemove: ApiController.linksRemove(Model)
    };
};

module.exports = ApiController;
