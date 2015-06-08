var express = require("express");

var ApiController = require("../controller/ApiController");
var ContentContainerController = require("../controller/ContentContainerController");

var router = express.Router();

// Pre-route validation
router.param("id", ApiController.validateId);

router.get("/", ContentContainerController.list);
router.post("/", ContentContainerController.create);
router.get("/:id", ContentContainerController.details);
router.patch("/:id", ContentContainerController.update);
router.delete("/:id", ContentContainerController.remove);

router.get("/:id/:link", ContentContainerController.linksList);
router.patch("/:id/:link", ContentContainerController.linksAdd);
router.delete("/:id/:link", ContentContainerController.linksRemove);

module.exports = router;
