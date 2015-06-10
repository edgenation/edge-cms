var express = require("express");

var ApiController = require("../controller/ApiController");
var PageController = require("../controller/PageController");

var router = express.Router();

// Pre-route validation
router.param("id", ApiController.validateId);

router.get("/", PageController.list);
router.post("/", PageController.create);
router.get("/:id", PageController.details);
router.patch("/:id", PageController.update);
router.delete("/:id", PageController.remove);

router.get("/:id/:relationship", PageController.includesList);
router.patch("/:id/:relationship", PageController.includesAdd);
router.delete("/:id/:relationship", PageController.includesRemove);

// API.restRouter("/page", Page);

module.exports = router;
