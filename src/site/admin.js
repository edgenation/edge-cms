var express = require("express");

var adminRouter = express.Router();

adminRouter.get("*", function (req, res, next) {
    // Server the admin route!
    return res.send("admin");
});

adminRouter.middleware = function (options) {
    options = options || {};
    var path = options.path || "/admin";

    return function(app, cms) {
        app.use(path, adminRouter);
    };
};

module.exports = adminRouter;
