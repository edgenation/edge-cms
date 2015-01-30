var mongoose = require("mongoose"),
    _ = require("lodash");

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

ApiController.updateProps = function (req) {
    return function (data) {
        _.forEach(req.body, function (value, prop) {
            data[prop] = value;
        });

        return data;
    };
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

    res.status(error.status).json(error);
};


module.exports = ApiController;
