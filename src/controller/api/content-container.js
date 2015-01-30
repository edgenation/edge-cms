var Q = require("q"),
    _ = require("lodash");

var Controller = require("../controller"),
    Content = require("../../model/content"),
    ContentContainer = require("../../model/content-container");


var ContentContainerController = {
    list: function (req, res, next) {
        Q.ninvoke(ContentContainer, "find")
            .then(Controller.checkDataReturned)
            .then(Controller.sendResponse(res))
            .fail(next);
    },

    create: function (req, res, next) {
        var model = new ContentContainer(req.body);

        Q.ninvoke(model, "save")
            .spread(Controller.checkDataReturned)
            .then(Controller.sendResponse(res, 201))
            .fail(next);
    },

    details: function (req, res, next) {
        var query = ContentContainer.findOne({_id: req.params.id}).populate("content");

        Q.ninvoke(query, "exec")
            .then(Controller.checkDataReturned)
            .then(Controller.sendResponse(res, 200))
            .fail(next);
    },

    update: function (req, res, next) {
        Q.ninvoke(ContentContainer, "findOne", {_id: req.params.id})
            .then(Controller.checkDataReturned)
            .then(Controller.updateProps(req))
            .then(function (model) {
                // Save the content container
                Q.ninvoke(model, "save")
                    .spread(Controller.checkDataReturned)
                    .then(Controller.sendResponse(res, 201))
                    .fail(next);
            }).fail(next);
    },

    remove: function (req, res, next) {
        Q.ninvoke(ContentContainer, "findByIdAndRemove", req.params.id)
            .then(Controller.sendResponse(res, 200))
            .fail(next);
    },

    listContent: function (req, res, next) {
        var query = ContentContainer.findOne({_id: req.params.id}).populate("content");

        Q.ninvoke(query, "exec")
            .then(Controller.checkDataReturned)
            .then(function (container) {
                Controller.sendResponse(res, 200)(container.content);
            })
            .fail(next);
    },

    addToContent: function (req, res, next) {
        Q.ninvoke(ContentContainer, "findOne", {_id: req.params.id})
            .then(Controller.checkDataReturned)
            .then(function (collection) {
                // Look for the object we are adding
                Q.ninvoke(Content, "findOne", {_id: req.params.iid})
                    .then(Controller.checkDataReturned)
                    .then(function (model) {
                        var val = _.find(collection.content, function (item) {
                            return item._id.equals(model._id);
                        });

                        if (val) {
                            // Already there...
                            Controller.sendResponse(res, 201)(collection);
                        } else {
                            // Add the model to the collection
                            collection.content.addToSet(model);

                            // Save the collection
                            Q.ninvoke(collection, "save")
                                .spread(Controller.checkDataReturned)
                                .then(Controller.sendResponse(res, 201))
                                .fail(next);
                        }
                    })
                    .fail(next);
            })
            .fail(next);
    },

    removeFromContent: function (req, res, next) {
        Q.ninvoke(ContentContainer, "findOne", {_id: req.params.id})
            .then(Controller.checkDataReturned)
            .then(function (collection) {
                // Remove the item
                collection.content.pull(req.params.iid);

                // Save the collection
                Q.ninvoke(collection, "save")
                    .spread(Controller.checkDataReturned)
                    .then(Controller.sendResponse(res, 201))
                    .fail(next);
            })
            .fail(next);
    }
};

module.exports = ContentContainerController;

