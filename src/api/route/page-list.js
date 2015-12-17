var express = require("express");

var ApiController = require("../controller/ApiController");
var PageListController = require("../controller/PageListController");

var router = express.Router();

// Pre-route validation
router.param("id", ApiController.validateId);
router.param("relationship", ApiController.validateRelationship(["pages"]));

router.get("/", PageListController.list);
router.post("/", PageListController.create);
router.get("/:id", PageListController.details);
router.put("/:id", PageListController.update);
router.patch("/:id", PageListController.update);
router.delete("/:id", PageListController.remove);

router.get("/:id/:relationship", PageListController.includesList);
router.put("/:id/:relationship", PageListController.includesAdd);
router.patch("/:id/:relationship", PageListController.includesAdd);
router.delete("/:id/:relationship", PageListController.includesRemove);

module.exports = router;
