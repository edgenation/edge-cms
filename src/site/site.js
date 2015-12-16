var express = require("express"),
    compression = require("compression"),
    bodyParser = require("body-parser"),
    helmet = require("helmet"),
    cors = require("cors"),
    responseTime = require("response-time"),
    nunjucks = require("nunjucks"),
    cookieParser = require("cookie-parser");



var CMS = function () {
    this.app = null;
    this.options = [];
    this.set("log", console);
    this.set("views", [__dirname + "/view"]);
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
    var logger = this.get("log");

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
        origin: '*'
    }));

    this.app.set("port", options.port || 4000);
    this.app.set("host", options.host || "0.0.0.0");

    this.app.engine("nunj", nunjucks.render);
    this.app.set("view engine", "nunj");
};

CMS.prototype.initApp = function () {
    // Set the views
    this.app.set("views", this.get("views"));

    var env = nunjucks.configure(this.get("views"), {
        autoescape: true,
        express: this.app,
        noCache: true // TODO: Change for production
    });


    // TODO: Externalize
    // Custom tag to load content mixins
    function CmsContent() {
        this.tags = ["cmsContent"];
        this.parse = function (parser, nodes, lexer) {
            var token = parser.nextToken();
            var args = parser.parseSignature(null, true);
            parser.advanceAfterBlockEnd(token.value);
            return new nodes.CallExtensionAsync(this, 'run', args);
        };
        this.run = function (context, theContent, callback) {
            var mixinName = "content" + theContent.type[0].toUpperCase() + theContent.type.slice(1);
            var mixinFile = "mixins/content/_" + theContent.type + ".nunj";

            context.env
                .getTemplate(mixinFile)
                .getExported(function (ctx, obj) {
                    callback(null, obj[mixinName](theContent));
                });
        };
    }

    env.addExtension("CmsContent", new CmsContent());


    this.app.use(express.static(__dirname + "/../../public"));
    this.app.use(express.static(__dirname + "/../../bower_components"));

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
