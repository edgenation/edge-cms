"use strict";

const path = require("path"),
    express = require("express"),
    compression = require("compression"),
    bodyParser = require("body-parser"),
    helmet = require("helmet"),
    cors = require("cors"),
    responseTime = require("response-time"),
    nunjucks = require("nunjucks"),
    CmsContent = require("./CmsContent"),
    markdown = require("nunjucks-markdown"),
    marked = require("marked"),
    cookieParser = require("cookie-parser");


class CMS {
    constructor() {
        this.app = null;
        this.options = [];
        this.set("log", console);
        this.set("views", [path.join(__dirname, "view")]);
        this.set("statics", { "/": [__dirname + "/../../public"] });
    }

    set(option, value) {
        this.options[option] = value;
    }

    modify(option, fn) {
        fn(this.options[option]);
    }

    get(option) {
        return this.options[option];
    }

    use(middleware) {
        return middleware(this.app, this);
    }

    log(level, msg) {
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
    }

    secureApp() {
        // Implement CSP with Helmet
        this.app.use(helmet.csp({
            // TODO: Make configurable
            directives: {
                defaultSrc: ["'self'"],
                scriptSrc: ["*.google-analytics.com"],
                styleSrc: ["'unsafe-inline'", "fonts.googleapis.com"],
                imgSrc: ["*.google-analytics.com"],
                connectSrc: ["'none'"],
                fontSrc: ["fonts.googleapis.com", "fonts.gstatic.com"],
                objectSrc: [],
                mediaSrc: [],
                frameSrc: []
            }
        }));

        // Implement X-XSS-Protection
        this.app.use(helmet.xssFilter());

        // Implement X-Frame: Deny
        this.app.use(helmet.frameguard());

        // Hide X-Powered-By
        this.app.use(helmet.hidePoweredBy());

        // TODO: Make configurable
        this.app.use(cors({
            origin: "*"
        }));
    }

    createApp(options) {
        options = options || {};
        this.app = express();
        this.app.use(compression());
        this.app.use(bodyParser.urlencoded({extended: true}));
        this.app.use(bodyParser.json());
        this.app.use(responseTime());

        this.secureApp();

        this.app.set("port", options.port || 4000);
        this.app.set("host", options.host || "0.0.0.0");

        this.app.engine("nunj", nunjucks.render);
        this.app.set("view engine", "nunj");
    }

    initApp() {
        // Set the views
        this.app.set("views", this.get("views"));

        this.nunjucks = nunjucks.configure(this.get("views"), {
            autoescape: true,
            express: this.app,
            // Disable view caching in development
            noCache: (this.app.get("env") === "development")
        });

        // Enable markdown
        markdown.register(this.nunjucks, marked);

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
    }

    startServer(callback) {
        this.initApp();

        this.app.listen(this.app.get("port"), this.app.get("host"), () => {
            if (callback) {
                callback();
            } else {
                console.log("CMS Server started: http://" + this.app.get("host") + ":" + this.app.get("port"));
            }
        });
    }
}

module.exports = CMS;
