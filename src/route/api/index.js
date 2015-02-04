var express = require("express"),
    bodyParser = require("body-parser");

var ApiController = require("../../controller/api");


var router = express.Router();

router.use(bodyParser.json());

// Add routes
router.use("/content", require("./content"));
router.use("/content-container", require("./content-container"));
router.use("/page", require("./page"));
router.use("/user", require("./user"));

// Error routes
router.use(ApiController.error404);
router.use(ApiController.error500);


module.exports = router;
