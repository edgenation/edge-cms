"use strict";

const DISABLED_CACHE = "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0";


/**
 * @namespace
 */
var errorHandler = {};


/**
 * @returns {Function}
 */
errorHandler.middleware = function () {
    return function (app, cms) {
        cms.log("info", "Enabling error handlers");

        cms.set("404", function (req, res, next) {
            // Don't cache 404s
            res.set({ "Cache-Control": DISABLED_CACHE });
            res.render("errors/404", { url: req.url });
        });

        cms.set("500", function (err, req, res, next) {
            cms.log("error", err.stack || err);

            // Don't cache 500s
            res.set({ "Cache-Control": DISABLED_CACHE });
            res.render("errors/500", { error: err.stack || err });
        });
    };
};

module.exports = errorHandler;
