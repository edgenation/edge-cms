var express = require("express");

var ApiController = require("../controller/ApiController");
var ContentController = require("../controller/ContentController");

var router = express.Router();

// Pre-route validation
router.param("id", ApiController.validateId);

router.get("/", ContentController.list);
router.post("/", ContentController.create);
router.get("/:id", ContentController.details);
router.patch("/:id", ContentController.update);
router.delete("/:id", ContentController.remove);

router.get("/:id/:relationship", ContentController.includesList);
router.patch("/:id/:relationship", ContentController.includesAdd);
router.delete("/:id/:relationship", ContentController.includesRemove);

module.exports = router;
