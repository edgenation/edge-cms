var express = require("express");

var apiController = require("../controller/api");


var router = express.Router();

// Pre-route validation
router.param("id", apiController.validateId);


// Models
var Content = require("../model/content");
var ContentContainer = require("../model/content-container");
//var Page = require("../model/page");
//var User = require("../model/user");


// Add routes
router.use("/content", apiController.restifyModel(Content));
router.use("/content-container", apiController.restifyModel(ContentContainer));
//router.use("/page", apiController.restifyModel(Page));
//router.use("/user", apiController.restifyModel(User));


// Error routes
router.use(apiController.error404);
router.use(apiController.error500);


module.exports = router;
