var Q = require("q");

var Controller = require("../controller"),
    Content = require("../../model/content");


var ContentController = {
    list: function (req, res, next) {
        Q.ninvoke(Content, "find")
            .then(Controller.checkDataReturned)
            .then(Controller.sendResponse(res))
            .fail(next);
    },

    create: function (req, res, next) {
        var model = new Content(req.body);

        Q.ninvoke(model, "save")
            .spread(Controller.checkDataReturned)
            .then(Controller.sendResponse(res, 201))
            .fail(next);
    },

    details: function (req, res, next) {
        Q.ninvoke(Content, "findOne", {_id: req.params.id})
            .then(Controller.checkDataReturned)
            .then(Controller.sendResponse(res, 200))
            .fail(next);
    },

    update: function (req, res, next) {
        Q.ninvoke(Content, "findOne", {_id: req.params.id})
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
        Q.ninvoke(Content, "findByIdAndRemove", req.params.id)
            .then(Controller.sendResponse(res, 200))
            .fail(next);
    }
};

module.exports = ContentController;

