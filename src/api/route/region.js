"use strict";

const express = require("express");

const ApiController = require("../controller/ApiController");
const RegionController = require("../controller/RegionController");


module.exports = function (readOnly) {
    let router = express.Router();

    // Pre-route validation
    router.param("id", ApiController.validateId);
    router.param("relationship", ApiController.validateRelationship(["content"]));

    router.get("/", RegionController.list);
    router.get("/:id", RegionController.details);
    router.get("/:id/:relationship", RegionController.includesList);

    if (!readOnly) {
        router.post("/", RegionController.create);
        router.put("/:id", RegionController.update);
        router.patch("/:id", RegionController.update);
        router.delete("/:id", RegionController.remove);
        router.put("/:id/:relationship", RegionController.includesAdd);
        router.patch("/:id/:relationship", RegionController.includesAdd);
        router.delete("/:id/:relationship", RegionController.includesRemove);
    }

    return router;
};
