"use strict";

var path = require("path"),
    express = require("express"),
    compression = require("compression"),
    bodyParser = require("body-parser"),
    helmet = require("helmet"),
    cors = require("cors"),
    responseTime = require("response-time"),
    nunjucks = require("nunjucks"),
    CmsContent = require("./CmsContent"),
    cookieParser = require("cookie-parser");



var CMS = function () {
    this.app = null;
    this.options = [];
    this.set("log", console);
    this.set("views", [path.join(__dirname, "view")]);
    this.set("statics", { "/": [__dirname + "/../../public"] });
};

CMS.prototype.set = function(option, value) {
    this.options[option] = value;
};

CMS.prototype.modify = function(option, fn) {
    fn(this.options[option]);
};

CMS.prototype.get = function(option) {
    return this.options[option];
};

CMS.prototype.use = function(middleware) {
    return middleware(this.app, this);
};

CMS.prototype.log = function(level, msg) {
    let logger = this.get("log");

    if (!logger) {
        return;
    }

    if (!msg) {
        msg = level;
        level = "log";
    }

    if (typeof logger[level] !== "function") {
        level = "log";
    }

    logger[level].call(this, msg);
};

CMS.prototype.createApp = function (options) {
    this.app = express();
    this.app.use(compression());
    this.app.use(bodyParser.urlencoded({extended: true}));
    this.app.use(bodyParser.json());
    this.app.use(responseTime());
    this.app.use(helmet());

    // TODO: Make configurable
    this.app.use(cors({
        origin: "*"
    }));

    this.app.set("port", options.port || 4000);
    this.app.set("host", options.host || "0.0.0.0");

    this.app.engine("nunj", nunjucks.render);
    this.app.set("view engine", "nunj");
};

CMS.prototype.initApp = function () {
    // Set the views
    this.app.set("views", this.get("views"));

    this.nunjucks = nunjucks.configure(this.get("views"), {
        autoescape: true,
        express: this.app,
        // Disable view caching in development
        noCache: (this.app.get("env") === "development")
    });

    // Custom tag to load content mixins
    this.nunjucks.addExtension("CmsContent", new CmsContent());

    // Static paths
    let statics = this.get("statics");
    for (let url in statics) {
        if (statics.hasOwnProperty(url)) {
            for (let path of statics[url]) {
                this.app.use(url, express.static(path));
            }
        }
    }

    // Set the error handlers if they exist
    var error404 = this.get("404");
    if (error404) {
        this.app.use(error404);
    }

    var error500 = this.get("500");
    if (error500) {
        this.app.use(error500);
    }
};

CMS.prototype.startServer = function () {
    this.initApp();

    this.app.listen(this.app.get("port"), this.app.get("host"), function () {
        console.log("CMS Server started: http://" + this.address().address + ":" + this.address().port);
    });
};

module.exports = CMS;
