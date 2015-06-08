var express = require("express"),
    bodyParser = require("body-parser");

var ApiController = require("../controller/ApiController");


var router = express.Router();

// Set the correct content type response header
router.use(function(req, res, next) {
    res.setHeader("Content-type", "application/vnd.api+json");
    next();
});

// Verify the content type header
//router.use(function (req, res, next) {
//    if (!req.headers || req.headers["content-type"] !== "application/vnd.api+json") {
//        return next({ status: 415, message: "415 Unsupported Media Type" });
//    }
//    next();
//});

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
