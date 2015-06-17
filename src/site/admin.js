var express = require("express");

var adminRouter = express.Router();

adminRouter.get("*", function (req, res, next) {
    // Server the admin route!
    return res.send("admin");
});


module.exports = function (options) {
    options = options || {};
    var path = options.path || "/admin";

    return {
        init: function(app, cms) {
            app.use(path, adminRouter);
        }
    }
};
