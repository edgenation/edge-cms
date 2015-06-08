var express = require("express");

var ApiController = require("../controller/ApiController");
var UserController = require("../controller/UserController");

var router = express.Router();

// TODO: Authorisation
router.use(function (req, res, next) {
    var err = new Error("Unauthorized");
    err.status = 401;
    next(err);
});

// Pre-route validation
router.param("id", ApiController.validateId);

router.get("/", UserController.list);
router.post("/", UserController.create);
router.get("/:id", UserController.details);
router.patch("/:id", UserController.update);
router.delete("/:id", UserController.remove);

router.get("/:id/:link", UserController.linksList);
router.patch("/:id/:link", UserController.linksAdd);
router.delete("/:id/:link", UserController.linksRemove);

module.exports = router;
