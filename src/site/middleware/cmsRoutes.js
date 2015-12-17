var Promise = require("bluebird");
var _ = require("lodash");
var rest = require("rest");
var mime = require("rest/interceptor/mime");
var pathPrefix = require("rest/interceptor/pathPrefix");
var timeout = require("rest/interceptor/timeout");
var apiAdapter = require("../apiAdapter");


// Load a cms page
function loadCmsPage(restClient, url) {
    // Attempt to load the page from the API
    return Promise.resolve(restClient({
        path: "/page",
        params: { "filter[url]=": url, include: "regions.content" }
    }));
}

var cmsRoutes = {};

cmsRoutes.middleware = function (options) {
    var apiConnectionString = options.api.protocol + "//" + options.api.host + ":" + options.api.port + options.api.path;

    var restClient = rest
        .wrap(timeout, { timeout: 10e3 })   // 10 seconds
        .wrap(mime, { mime: "application/vnd.api+json" })
        .wrap(pathPrefix, { prefix: apiConnectionString });

    // TODO: Get from options
    var skipPaths = [
        /^\/api(\/|^\/+)/,
        /^\/favicon.ico$/
    ];

    return function (app, cms) {
        // Check to see if this page exists in the API
        app.use(function cmsPage (req, res, next) {
            // Skip some paths as they are not cms managed
            var skip = _.some(skipPaths, function (path) { return path.test(req.path) });
            if (skip) {
                return next();
            }

            loadCmsPage(restClient, req.path).then(function (response) {
                // Page not found
                if (!response.entity.data.length) {
                    return next();
                }

                if (req.query.raw) {
                    return res.send(response.entity);
                }

                var page = apiAdapter.page(response);

                return res.render("templates/page/" + page.template, { page: page });
            }).catch(function (response) {
                // API error
                next(response.entity || response);
            });
        });
    };
};

module.exports = cmsRoutes;
