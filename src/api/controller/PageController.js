var ApiController = require("./ApiController"),
    Page = require("../model/PageModel");


// http://jsonapi.org/format/
var PageController = ApiController.restForModel(Page, 1);

/*
    addToContainers: function (req, res, next) {
        Q.ninvoke(Page, "findOne", {_id: req.params.id})
            .then(ApiController.checkDataReturned)
            .then(function (page) {
                // Look for the object we are adding
                Q.ninvoke(ContentContainer, "findOne", {_id: req.params.iid})
                    .then(ApiController.checkDataReturned)
                    .then(function (model) {
                        var val = _.find(page.regions, function (item) {
                            return item._id.equals(model._id);
                        });

                        if (val) {
                            // Already there...
                            ApiController.sendResponse(res, 201)(page);
                        } else {
                            // Add the model to the collection
                            page.regions.addToSet(model);

                            // Save the collection
                            Q.ninvoke(page, "save")
                                .spread(ApiController.checkDataReturned)
                                .then(ApiController.sendResponse(res, 201))
                                .catch(next);
                        }
                    })
                    .catch(next);
            })
            .catch(next);
    },

    removeFromContainers: function (req, res, next) {
        Q.ninvoke(Page, "findOne", {_id: req.params.id})
            .then(ApiController.checkDataReturned)
            .then(function (page) {
                // Remove the item
                page.regions.pull(req.params.iid);

                // Save the page
                Q.ninvoke(page, "save")
                    .spread(ApiController.checkDataReturned)
                    .then(ApiController.sendResponse(res, 201))
                    .catch(next);
            })
            .catch(next);
    }
*/

module.exports = PageController;
