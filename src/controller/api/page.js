var Q = require("q"),
    _ = require("lodash");

var ApiController = require("./index"),
    ContentContainer = require("../../model/content-container"),
    Page = require("../../model/page");




// http://jsonapi.org/format/
//var PageController = ApiController.restForModel(Page, 2);
var PageController = {
    list: ApiController.list(Page, "pages", 2),
    create: ApiController.create(Page, "page"),
    details: ApiController.details(Page, "page"),
    update: ApiController.update(Page, "page"),
    remove: ApiController.remove(Page, "page"),

    listLinks: ApiController.listLinks(Page),


    addToContainers: function (req, res, next) {},
    removeFromContainers: function (req, res, next) {}
/*
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

