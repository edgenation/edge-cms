"use strict";

const express = require("express");

const adminRouter = express.Router();


adminRouter.get("*", function (req, res, next) {
    // Server the admin route!
    return res.render("templates/admin/index");
});


/**
 * @param {Object} [options={}]
 * @returns {Function}
 */
adminRouter.middleware = function (options) {
    options = options || {};
    var path = options.path || "/admin";

    return function(app, cms) {
        app.use(path, adminRouter);
    };
};


module.exports = adminRouter;
