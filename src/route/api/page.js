var express = require("express");

var ApiController = require("../../controller/api");
var Controller = require("../../controller/api/page");

var router = express.Router();

// Pre-route validation
router.param("id", ApiController.validateId);
router.param("iid", ApiController.validateId);

router.get("/", Controller.list);
router.post("/", Controller.create);
router.get("/:id", Controller.details);
router.put("/:id", Controller.update);
router.delete("/:id", Controller.remove);

router.get("/:id/links/:link", Controller.listLinks);
//router.put("/:id/containers/:iid", Controller.addToContainers);
//router.delete("/:id/containers/:iid", Controller.removeFromContainers);

// API.restRouter("/page", Page);

module.exports = router;
