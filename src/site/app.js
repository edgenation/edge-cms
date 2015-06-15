var express = require("express"),
    compression = require("compression"),
    bodyParser = require("body-parser"),
    helmet = require("helmet"),
    responseTime = require("response-time"),
    cookieParser = require("cookie-parser");


var CMS = function () {
    this.app = null;
};

CMS.prototype.createApp = function (options) {
    this.app = express();
    this.app.use(compression());
    this.app.use(bodyParser.urlencoded({extended: true}));
    this.app.use(bodyParser.json());
    this.app.use(responseTime());
    this.app.use(helmet());

    this.app.set("port", options.port || 4000);
    this.app.set("host", options.host || "0.0.0.0");

    this.app.set("view engine", "jade");
    this.app.set("views", __dirname + "/view");

    // View CMS pages
    this.app.use(require("./cmsRouter")());

    // TODO: Add cms routes etc
    this.app.use(express.static(__dirname + "/../../public"));
    this.app.use(express.static(__dirname + "/../../bower_components"));

    return this.app;
};

CMS.prototype.startServer = function () {
    // TODO: Add error handler routes

    this.app.listen(this.app.get("port"), this.app.get("host"), function () {
        console.log("CMS Server started: http://" + this.address().address + ":" + this.address().port);
    });
};

module.exports = new CMS();
