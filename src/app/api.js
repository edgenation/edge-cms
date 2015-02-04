var Q = require("q"),
    mongoose = require("mongoose"),
    methodOverride = require("method-override"),
    express = require("express"),
    compression = require("compression"),
    bodyParser = require("body-parser"),
    helmet = require("helmet"),
    responseTime = require("response-time"),
    cookieParser = require("cookie-parser");


var API = function () {
    this.app = null;
};

API.prototype.createApp = function () {
    this.app = express();
    this.app.use(compression());
    //this.app.use(bodyParser.urlencoded({extended: true}));
    //this.app.use(bodyParser.json());
    this.app.use(responseTime());
    this.app.use(helmet());
    this.app.use(methodOverride());
    this.app.use("/api", require("../route/api"));

    this.app.set("port", process.env.PORT || 4000);
    this.app.set("host", process.env.HOST || "0.0.0.0");

    return this.app;
};

API.prototype.useApp = function (app) {
    this.app = app;
    this.app.use(methodOverride());
    this.app.use("/api", require("../route/api"));
};

API.prototype.connectDB = function () {
    return Q.ninvoke(mongoose, "connect", "mongodb://localhost/edge-cms-prototype");
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
        .fail(function (err) {
            console.error("Fatal Error:", err);
            mongoose.disconnect();
        });
};

module.exports = new API();
