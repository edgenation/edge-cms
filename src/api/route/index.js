"use strict";

const _ = require("lodash"),
    express = require("express"),
    bodyParser = require("body-parser"),
    requireDir = require("require-dir");

const ApiController = require("../controller/ApiController");


module.exports = function (readOnly) {
    let router = express.Router();

    // Set the correct content type response header
    router.use(function (req, res, next) {
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

    // Add all routes
    let routes = requireDir();

    _.forEach(routes, function (route, slug) {
        router.use("/" + slug, route(readOnly));
    });


    // Error routes
    router.use(ApiController.error404);
    router.use(ApiController.error500);

    return router;
};
