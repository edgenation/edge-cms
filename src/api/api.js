var Q = require("q"),
    mongoose = require("mongoose"),
    express = require("express"),
    compression = require("compression"),
    bodyParser = require("body-parser"),
    helmet = require("helmet"),
    responseTime = require("response-time"),
    cookieParser = require("cookie-parser");


var API = function () {
    this.app = null;
};

API.prototype.createApp = function (options) {
    this.app = express();
    this.app.use(compression());
    //this.app.use(bodyParser.urlencoded({extended: true}));
    //this.app.use(bodyParser.json());
    this.app.use(responseTime());
    this.app.use(helmet());
    this.app.use("/api", require("./route/index"));

    this.app.set("port", options.port || 4000);
    this.app.set("host", options.host || "0.0.0.0");

    return this.app;
};

API.prototype.useApp = function (app, path) {
    path = path || "/api";

    this.app = app;
    this.app.use(path, require("./route/index"));
};

API.prototype.middleware = function (options) {
    var api = this;
    options = options || {};

    return function(app, cms) {
        api.useApp(app, options.path);
    };
};

API.prototype.connectDB = function (path) {
    return Q.ninvoke(mongoose, "connect", path);
};

API.prototype.disconnectDB = function () {
    mongoose.disconnect();
};

API.prototype.startServer = function () {
    var app = this.app;

    this.connectDB()
        .then(function () {
            app.listen(app.get("port"), app.get("host"), function () {
                console.log("CMS API Server started: http://" + this.address().address + ":" + this.address().port);
            });
        })
        .catch(function (err) {
            console.error("Fatal Error:", err);
            mongoose.disconnect();
        });
};

module.exports = new API();
