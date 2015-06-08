var express = require("express");

var ApiController = require("../../controller/api");
var Controller = require("../../controller/api/content");

var router = express.Router();

// Pre-route validation
router.param("id", ApiController.validateId);

router.get("/", Controller.list);
router.post("/", Controller.create);
router.get("/:id", Controller.details);
router.put("/:id", Controller.update);
router.delete("/:id", Controller.remove);

router.get("/:id/:link", Controller.linksList);
router.put("/:id/:link", Controller.linksAdd);
router.delete("/:id/:link", Controller.linksRemove);

module.exports = router;
