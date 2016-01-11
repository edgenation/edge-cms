"use strict";

var express = require("express");

var ApiController = require("../controller/ApiController");
var UserController = require("../controller/UserController");


module.exports = function (readOnly) {
    let router = express.Router();

    // TODO: Authorisation
    router.use(function (req, res, next) {
        let err = new Error("Unauthorized");
        err.status = 401;
        next(err);
    });

    // Pre-route validation
    router.param("id", ApiController.validateId);
    router.get("/", UserController.list);
    router.get("/:id", UserController.details);

    // TODO: User sanitation?

    if (!readOnly) {
        router.post("/", UserController.create);
        router.put("/:id", UserController.update);
        router.patch("/:id", UserController.update);
        router.delete("/:id", UserController.remove);
    }

    return router;
};
