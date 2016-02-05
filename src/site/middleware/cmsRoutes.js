"use strict";

const _ = require("lodash");
const apiAdapter = require("../apiAdapter");
const apiService = require("../apiService");


var cmsRoutes = {};

cmsRoutes.middleware = function (options) {
    options = options || {};
    var skipRoutes = options.skipRoutes || [];

    return function (app, cms) {
        // Check to see if this page exists in the API
        app.use(function cmsPage (req, res, next) {
            // Skip some paths as they are not cms managed
            if (_.some(skipRoutes, path => path.test(req.path))) {
                return next();
            }

            // TODO: Being called twice??
            // console.log("Request 1", req.method, req.url, req.params, req.query);

            apiService.loadPage(req.path).then(function (response) {
                // Page not found
                if (!response.data.length) {
                    return next();
                }

                if (req.query.raw && app.get("env") === "development") {
                    return res.send(response);
                }

                let page = apiAdapter.page(response);

                if (app.get("env") === "development" && response.debug) {
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
