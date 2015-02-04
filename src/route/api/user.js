var express = require("express");

var ApiController = require("../../controller/api");
var Controller = require("../../controller/api/user");

var router = express.Router();

// TODO: Authorisation
router.use(function (req, res, next) {
    var err = new Error("Unauthorized");
    err.status = 401;
    next(err);
});

// Pre-route validation
router.param("id", ApiController.validateId);
router.param("iid", ApiController.validateId);

router.get("/", Controller.list);
router.post("/", Controller.create);
router.get("/:id", Controller.details);
router.put("/:id", Controller.update);
router.delete("/:id", Controller.remove);


module.exports = router;