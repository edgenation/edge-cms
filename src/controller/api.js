var mongoose = require("mongoose"),
    express = require("express"),
    Q = require("q");

var Controller = require("./controller");

var ApiController = {};


ApiController.restifyModel = function (Model) {
    var router = express.Router();

    // Get all content containers
    router.get("/", function (req, res, next) {
        // TODO: Add a ?count=X query string limit

        // TODO: Validate the count - is there an express pre-thing to do this?

        Q.ninvoke(Model, "find")
            .then(Controller.checkDataReturned)
            .then(Controller.sendResponse(res))
            .fail(next);
    });

    // Create a new content container
    router.post("/", function (req, res, next) {
        var model = new Model(req.body);

        Q.ninvoke(model, "save")
            .spread(Controller.checkDataReturned)
            .then(Controller.sendResponse(res, 201))
            .fail(next);
            //.fail(next);
    });

    // Get a single content container
    router.get("/:id", function (req, res, next) {
        Q.ninvoke(Model, "findOne", {_id: req.params.id})
            .then(Controller.checkDataReturned)
            .then(Controller.sendResponse(res))
            .fail(next);
    });

    // Update an existing content container
    router.put("/:id", function (req, res, next) {
        Q.ninvoke(Model, "findOne", {_id: req.params.id})
            .then(Controller.checkDataReturned)
            .then(Controller.updateProps(req))
            .then(function (model) {
                // Save the content container
                Q.ninvoke(model, "save")
                    .spread(Controller.checkDataReturned)
                    .then(Controller.sendResponse(res, 201))
                    .fail(next);
            }).fail(next);
    });

    // Delete an existing content container
    router.delete("/:id", function (req, res, next) {
        Q.ninvoke(Model, "findByIdAndRemove", req.params.id)
            .then(Controller.sendResponse(res, 200))
            .fail(next);
    });

    router.all("/", ApiController.methodNotAllowed);
    router.all("/:id", ApiController.methodNotAllowed);

    return router;
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


ApiController.methodNotAllowed = function (req, res, next) {
    var err = new Error("Method Not Allowed");
    err.status = 405;
    next(err);
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
