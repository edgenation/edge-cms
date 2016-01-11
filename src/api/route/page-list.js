"use strict";

var express = require("express");

var ApiController = require("../controller/ApiController");
var PageListController = require("../controller/PageListController");


module.exports = function (readOnly) {
    let router = express.Router();

    // Pre-route validation
    router.param("id", ApiController.validateId);
    router.param("relationship", ApiController.validateRelationship(["pages"]));

    router.get("/", PageListController.list);
    router.get("/:id", PageListController.details);
    router.get("/:id/:relationship", PageListController.includesList);

    if (!readOnly) {
        router.post("/", PageListController.create);
        router.put("/:id", PageListController.update);
        router.patch("/:id", PageListController.update);
        router.delete("/:id", PageListController.remove);
        router.put("/:id/:relationship", PageListController.includesAdd);
        router.patch("/:id/:relationship", PageListController.includesAdd);
        router.delete("/:id/:relationship", PageListController.includesRemove);
    }

    return router;
};
