"use strict";

var express = require("express");

var ApiController = require("../controller/ApiController");
var PageController = require("../controller/PageController");


module.exports = function (readOnly) {
    let router = express.Router();

    // Pre-route validation
    router.param("id", ApiController.validateId);
    router.param("relationship", ApiController.validateRelationship(["regions"]));

    router.get("/", PageController.list);
    router.get("/:id", PageController.details);
    router.get("/:id/:relationship", PageController.includesList);

    if (!readOnly) {
        router.post("/", PageController.create);
        router.put("/:id", PageController.update);
        router.patch("/:id", PageController.update);
        router.delete("/:id", PageController.remove);
        router.put("/:id/:relationship", PageController.includesAdd);
        router.patch("/:id/:relationship", PageController.includesAdd);
        router.delete("/:id/:relationship", PageController.includesRemove);
    }

    // API.restRouter("/page", Page);

    return router;
};
