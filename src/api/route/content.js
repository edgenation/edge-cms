"use strict";

const express = require("express");

const ApiController = require("../controller/ApiController");
const ContentController = require("../controller/ContentController");


module.exports = function (readOnly) {
    let router = express.Router();

    // Pre-route validation
    router.param("id", ApiController.validateId);

    router.get("/", ContentController.list);
    router.get("/:id", ContentController.details);
    router.get("/:id/:relationship", ContentController.includesList);

    if (!readOnly) {
        router.post("/", ContentController.create);
        router.put("/:id", ContentController.update);
        router.patch("/:id", ContentController.update);
        router.delete("/:id", ContentController.remove);
        router.put("/:id/:relationship", ContentController.includesAdd);
        router.patch("/:id/:relationship", ContentController.includesAdd);
        router.delete("/:id/:relationship", ContentController.includesRemove);
    }

    return router;
};
