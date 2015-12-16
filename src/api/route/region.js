var express = require("express");

var ApiController = require("../controller/ApiController");
var RegionController = require("../controller/RegionController");

var router = express.Router();

// Pre-route validation
router.param("id", ApiController.validateId);

router.get("/", RegionController.list);
router.post("/", RegionController.create);
router.get("/:id", RegionController.details);
router.put("/:id", RegionController.update);
router.patch("/:id", RegionController.update);
router.delete("/:id", RegionController.remove);

router.get("/:id/content", RegionController.includesList);
router.put("/:id/content", RegionController.includesAdd);
router.patch("/:id/content", RegionController.includesAdd);
router.delete("/:id/content", RegionController.includesRemove);

module.exports = router;
