var Q = require("q");

var ApiController = require("./index"),
    User = require("../../model/user");


var UserController = {
    list: function (req, res, next) {
        Q.ninvoke(User, "find")
            .then(ApiController.checkDataReturned)
            .then(ApiController.sendResponse(res))
            .fail(next);
    },

    create: function (req, res, next) {
        var model = new User(req.body);

        Q.ninvoke(model, "save")
            .spread(ApiController.checkDataReturned)
            .then(ApiController.sendResponse(res, 201))
            .fail(next);
    },

    details: function (req, res, next) {
        Q.ninvoke(User, "findOne", {_id: req.params.id})
            .then(ApiController.checkDataReturned)
            .then(ApiController.sendResponse(res, 200))
            .fail(next);
    },

    update: function (req, res, next) {
        Q.ninvoke(User, "findOne", {_id: req.params.id})
            .then(ApiController.checkDataReturned)
            .then(ApiController.updateProps(req))
            .then(function (model) {
                // Save the user
                Q.ninvoke(model, "save")
                    .spread(ApiController.checkDataReturned)
                    .then(ApiController.sendResponse(res, 201))
                    .fail(next);
            }).fail(next);
    },

    remove: function (req, res, next) {
        Q.ninvoke(User, "findByIdAndRemove", req.params.id)
            .then(ApiController.sendResponse(res, 200))
            .fail(next);
    }
};

module.exports = UserController;

