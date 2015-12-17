var express = require("express");

var ApiController = require("../controller/ApiController");
var RegionController = require("../controller/RegionController");

var router = express.Router();

// Pre-route validation
router.param("id", ApiController.validateId);
router.param("id", ApiController.validateRelationship(["content"]));

router.get("/", RegionController.list);
router.post("/", RegionController.create);
router.get("/:id", RegionController.details);
router.put("/:id", RegionController.update);
router.patch("/:id", RegionController.update);
router.delete("/:id", RegionController.remove);

router.get("/:id/:relationship", RegionController.includesList);
router.put("/:id/:relationship", RegionController.includesAdd);
router.patch("/:id/:relationship", RegionController.includesAdd);
router.delete("/:id/:relationship", RegionController.includesRemove);

module.exports = router;
