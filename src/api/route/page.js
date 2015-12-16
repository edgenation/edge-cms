var express = require("express");

var ApiController = require("../controller/ApiController");
var PageController = require("../controller/PageController");

var router = express.Router();

// Pre-route validation
router.param("id", ApiController.validateId);

router.get("/", PageController.list);
router.post("/", PageController.create);
router.get("/:id", PageController.details);
router.put("/:id", PageController.update);
router.patch("/:id", PageController.update);
router.delete("/:id", PageController.remove);

router.get("/:id/regions", PageController.includesList);
router.put("/:id/regions", PageController.includesAdd);
router.patch("/:id/regions", PageController.includesAdd);
router.delete("/:id/regions", PageController.includesRemove);

// API.restRouter("/page", Page);

module.exports = router;
