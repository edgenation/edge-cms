"use strict";

const ApiDataService = require("../service/ApiDataService");

/** @namespace */
var ApiController = {};


/**
 * Send the response as json
 *
 * @param {Object} res - The HTTP response
 * @param {number} [status=200] - The HTTP stats
 * @returns {Function}
 */
ApiController.sendResponse = function (res, status) {
    status = status || 200;

    return function (data) {
        res.status(status).json(data);
    };
};


/**
 * Checks that some data has been returned
 *
 * @throws {null} If the data does not exist
 * @param {Object} data - The data to check
 * @returns {Object} The data
 */
ApiController.checkDataReturned = function (data) {
    if (!data) {
        throw null;
    }

    return data;
};


/**
 * Router middleware to validate the :id parameter
 *
 * @param {Object} req - The HTTP request
 * @param {Object} res - The HTTP response
 * @param {Function} next - The next middleware
 * @param {string|number} id - A mongodb id
 */
ApiController.validateId = function (req, res, next, id) {
    if (!ApiDataService.isValidId(id)) {
        let err = new Error("Invalid ID");
        err.status = 400;
        return next(err);
    }

    next();
};


/**
 * Router middleware to validate the :relationship parameter
 *
 * @param {Array} relationships
 * @returns {Function}
 */
ApiController.validateRelationship = function(relationships) {
    return function (req, res, next, relationship) {
        // Check relationship is in relationships
        if (!relationships || relationships.indexOf(relationship) === -1) {
            let err = new Error("Invalid Relationship");
            err.status = 400;
            return next(err);
        }

        next();
    };
};


/**
 * Router level 404 handler
 *
 * @param {Object} req - The HTTP request
 * @param {Object} res - The HTTP response
 * @param {Function} next - The next middleware
 */
ApiController.error404 = function (req, res, next) {
    let err = new Error("Not Found");
    err.status = 404;
    next(err);
};


/**
 * Router level error handler
 *
 * @param {Object} err - The error
 * @param {Object} req - The HTTP request
 * @param {Object} res - The HTTP response
 * @param {Function} next - The next middleware
 */
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
    if (process.env.NODE_ENV === "development" && error.status === 500 && err.stack) {
        error.stack = err.stack;
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


/**
 * @param {Object} Model
 * @param {number} pageSize
 * @returns {Function}
 */
ApiController.list = function (Model, pageSize) {
    return function (req, res, next) {
        ApiDataService.list(req, Model, pageSize)
            .then(ApiController.sendResponse(res, 200))
            .catch(next);
    };
};


/**
 * @param {Object} Model
 * @returns {Function}
 */
ApiController.create = function (Model) {
    return function (req, res, next) {
        ApiDataService.create(req, Model)
            .then(function (response) {
                // TODO: Use current URL to generate new one?
                res.setHeader("Location", "/api/" + Model.modelName + "/" + response.data.id);
                return response;
            })
            .then(ApiController.sendResponse(res, 201))
            .catch(next);
    };
};


/**
 * @param {Object} Model
 * @returns {Function}
 */
ApiController.details = function (Model) {
    return function (req, res, next) {
        ApiDataService.details(req, Model)
            .then(ApiController.sendResponse(res, 200))
            .catch(next);
    };
};


/**
 * @param {Object} Model
 * @returns {Function}
 */
ApiController.update = function (Model) {
    return function (req, res, next) {
        ApiDataService.update(req, Model)
            .then(ApiController.sendResponse(res, 200))
            .catch(next);
    };
};


/**
 * @param {Object} Model
 * @returns {Function}
 */
ApiController.remove = function (Model) {
    return function (req, res, next) {
        ApiDataService.update(req, Model)
            .then(ApiController.sendResponse(res, 204))
            .catch(next);
    };
};


/**
 * @param {Object} Model
 * @param {number} pageSize
 * @returns {Function}
 */
ApiController.includesList = function (Model, pageSize) {
    return function (req, res, next) {
        ApiDataService.includesList(req, Model, pageSize)
            .then(ApiController.sendResponse(res, 200))
            .catch(next);
    };
};


/**
 * @param {Object} Model
 * @returns {Function}
 */
ApiController.includesAdd = function (Model) {
    return function (req, res, next) {
        ApiDataService.includesAdd(req, Model)
            .then(ApiController.sendResponse(res, 200))
            .catch(next);
    };
};


/**
 * @param {Object} Model
 * @returns {Function}
 */
ApiController.includesRemove = function (Model) {
    return function (req, res, next) {
        ApiDataService.includesRemove(req, Model)
            .then(ApiController.sendResponse(res, 200))
            .catch(next);
    };
};

/**
 * @param {Object} Model
 * @param {number} [perPage=10]
 * @returns {{list: Function, create: Function, details: Function, update: Function, remove: Function, includesList: Function, includesAdd: Function, includesRemove: Function}}
 */
ApiController.restForModel = function (Model, perPage) {
    perPage = perPage || 10;

    return {
        list: ApiController.list(Model, perPage),
        create: ApiController.create(Model),
        details: ApiController.details(Model),
        update: ApiController.update(Model),
        remove: ApiController.remove(Model),
        includesList: ApiController.includesList(Model, perPage),
        includesAdd: ApiController.includesAdd(Model),
        includesRemove: ApiController.includesRemove(Model)
    };
};


module.exports = ApiController;
