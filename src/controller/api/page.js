var Q = require("q"),
    _ = require("lodash");

var ApiController = require("./index"),
    ContentContainer = require("../../model/content-container"),
    Page = require("../../model/page");


var PageController = {
    list: function (req, res, next) {
        Q.ninvoke(Page, "find")
            .then(ApiController.checkDataReturned)
            .then(ApiController.sendResponse(res))
            .fail(next);
    },

    create: function (req, res, next) {
        var model = new Page(req.body);

        Q.ninvoke(model, "save")
            .spread(ApiController.checkDataReturned)
            .then(ApiController.sendResponse(res, 201))
            .fail(next);
    },

    details: function (req, res, next) {
        var query = Page.findOne({_id: req.params.id}).populate("containers");

        Q.ninvoke(query, "exec")
            .then(ApiController.checkDataReturned)
            .then(function (page) {
                Q.ninvoke(ContentContainer, "populate", page.containers, {path: "content"})
                    .then(function () {
                        ApiController.sendResponse(res, 200)(page);
                    })
                    .fail(next);
            })
            .fail(next);
    },

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
};

module.exports = PageController;

