var mongoose = require("mongoose"),
    express = require("express"),
    Q = require("q"),
    _ = require("lodash");

var Controller = require("./controller");

var ApiController = {};


ApiController.restifyModel = function (Model) {
    var router = express.Router();

    // Get all content containers
    router.get("/", function (req, res, next) {
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

ApiController.restifyModelCollection = function (CollectionModel, collectionName, Model) {
    var router = express.Router({mergeParams: true});

    router.use(function (req, res, next) {
        // Load the CollectionModel
        var query = CollectionModel.findOne({_id: req.params.cid}).populate(collectionName);

        Q.ninvoke(query, "exec")
            .then(Controller.checkDataReturned)
            .then(function (collection) {
                req.collection = collection;
                next();
            })
            .fail(next);
    });

    // Get all the items in the collection
    router.get("/", function (req, res, next) {
        res.send(req.collection[collectionName]);
    });

    // Put an item in the collection
    router.put("/", function (req, res, next) {
        Q.ninvoke(Model, "findOne", {_id: req.body.id})
            .then(Controller.checkDataReturned)
            .then(function (model) {
                var val = _.find(req.collection[collectionName], function (item) {
                    return item._id.equals(model._id);
                });

                if (val) {
                    // Already there...
                    Controller.sendResponse(res, 201)(req.collection);
                } else {
                    // Add the model to the collection
                    req.collection[collectionName].addToSet(model);

                    // Save the collection
                    Q.ninvoke(req.collection, "save")
                        .spread(Controller.checkDataReturned)
                        .then(Controller.sendResponse(res, 201))
                        .fail(next);
                }
            })
            .fail(next);
    });

    // Remove an item from the collection
    router.delete("/:id", function (req, res, next) {
        req.collection[collectionName].pull(req.params.id);

        // Save the collection
        Q.ninvoke(req.collection, "save")
            .spread(Controller.checkDataReturned)
            .then(Controller.sendResponse(res, 201))
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
