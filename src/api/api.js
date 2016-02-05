"use strict";

var Promise = require("bluebird"),
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
    options = options || {};
    this.app = express();
    this.app.use(compression());
    //this.app.use(bodyParser.urlencoded({extended: true}));
    //this.app.use(bodyParser.json());
    this.app.use(responseTime());
    this.secureApp();

    this.app.use(options.path, require("./route/index")(options.readOnly));

    this.app.set("port", options.port || 4000);
    this.app.set("host", options.host || "0.0.0.0");

    return this.app;
};

API.prototype.secureApp = function () {
    this.app.use(helmet());
};

API.prototype.useApp = function (app, path) {
    path = path || "/api";

    this.app = app;
    this.app.use(path, require("./route/index"));
};

API.prototype.middleware = function (options) {
    let api = this;
    options = options || {};

    return function(app, cms) {
        api.useApp(app, options.path);
    };
};

API.prototype.connectDB = function (dbUri) {
    var options = {
        db: {
            numberOfRetries: 10,
            retryMiliSeconds: 1000
        },
        server: {
            auto_reconnect: true,
            poolSize: 5,
            socketOptions: {
                keepAlive: 1
            }
        },
        replset: {
            socketOptions: {
                keepAlive: 1
            }
        }
    };

    return Promise.promisify(mongoose.connect, mongoose)(dbUri, options).then(function () {
        mongoose.connection.on("error", console.error.bind(console, "MongoDB error:"));
    });
};

API.prototype.disconnectDB = function () {
    mongoose.disconnect();
};

API.prototype.startServer = function () {
    let app = this.app;

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
