"use strict";

var _ = require("lodash");
var apiAdapter = require("../apiAdapter");
var apiService = require("../apiService");


var cmsRoutes = {};

cmsRoutes.middleware = function (options) {
    var skipRoutes = options.skipRoutes || [];

    return function (app, cms) {
        // Check to see if this page exists in the API
        app.use(function cmsPage (req, res, next) {
            // TODO: Being called twice??
            console.debug("Request 1");
            // Skip some paths as they are not cms managed
            if (_.some(skipRoutes, path => path.test(req.path))) {
                return next();
            }

            apiService.loadPage(req.path).then(function (response) {
                // Page not found
                if (!response.data.length) {
                    return next();
                }

                if (req.query.raw && app.get("env") === "development") {
                    return res.send(response);
                }

                var page = apiAdapter.page(response);

                if (app.get("env") === "development") {
                   page.debug = JSON.stringify(response.debug);
                }

                if (req.query.json) {
                    return res.json(page);
                }

                return res.render(`templates/page/${page.template}`, { page });
            }).catch(next);
        });
    };
};

module.exports = cmsRoutes;
