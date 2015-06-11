var ApiDataService = require("../service/ApiDataService");

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
    if (!ApiDataService.isValidId(id)) {
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


ApiController.list = function (Model, pageSize) {
    return function (req, res, next) {
        ApiDataService.list(req, Model, pageSize)
            .then(ApiController.sendResponse(res, 200))
            .fail(next);
    };
};

ApiController.create = function (Model) {
    return function (req, res, next) {
        ApiDataService.create(req, Model)
            .then(function (response) {
                // TODO: Use current URL to generate new one?
                res.setHeader("Location", "/api/" + Model.modelName + "/" + response.data.id);
                return response;
            })
            .then(ApiController.sendResponse(res, 201))
            .fail(next);
    };
};

ApiController.details = function (Model) {
    return function (req, res, next) {
        ApiDataService.details(req, Model)
            .then(ApiController.sendResponse(res, 200))
            .fail(next);
    };
};

ApiController.update = function (Model) {
    return function (req, res, next) {
        ApiDataService.update(req, Model)
            .then(ApiController.sendResponse(res, 200))
            .fail(next);
    };
};

ApiController.remove = function (Model) {
    return function (req, res, next) {
        ApiDataService.update(req, Model)
            .then(ApiController.sendResponse(res, 204))
            .fail(next);
    };
};

ApiController.includesList = function (Model) {
    return function (req, res, next) {
        ApiDataService.includesList(req, Model)
            .then(ApiController.sendResponse(res, 200))
            .fail(next);
    };
};

ApiController.includesAdd = function (Model) {
    return function (req, res, next) {
        ApiDataService.includesAdd(req, Model)
            .then(ApiController.sendResponse(res, 200))
            .fail(next);
    };
};

ApiController.includesRemove = function (Model) {
    return function (req, res, next) {
        ApiDataService.includesRemove(req, Model)
            .then(ApiController.sendResponse(res, 200))
            .fail(next);
    };
};

ApiController.restForModel = function (Model, perPage) {
    perPage = perPage || 2;
    var singularProperty = Model.modelName.substr(0, 1).toLowerCase() + Model.modelName.substr(1);

    return {
        list: ApiController.list(Model, perPage),
        create: ApiController.create(Model),
        details: ApiController.details(Model),
        update: ApiController.update(Model),
        remove: ApiController.remove(Model),
        includesList: ApiController.includesList(Model),
        includesAdd: ApiController.includesAdd(Model),
        includesRemove: ApiController.includesRemove(Model)
    };
};

module.exports = ApiController;
