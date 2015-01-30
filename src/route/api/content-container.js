var express = require("express");

var ApiController = require("../../controller/api");
var Controller = require("../../controller/api/content-container");

var router = express.Router();

// Pre-route validation
router.param("id", ApiController.validateId);
router.param("iid", ApiController.validateId);

router.get("/", Controller.list);
router.post("/", Controller.create);
router.get("/:id", Controller.details);
router.put("/:id", Controller.update);
router.delete("/:id", Controller.remove);

router.get("/:id/content", Controller.listContent);
router.put("/:id/content/:iid", Controller.addToContent);
router.delete("/:id/content/:iid", Controller.removeFromContent);


module.exports = router;
