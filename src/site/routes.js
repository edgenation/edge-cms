var Q = require("q");
var rest = require("rest");
var mime = require("rest/interceptor/mime");
var pathPrefix = require("rest/interceptor/pathPrefix");
var timeout = require("rest/interceptor/timeout");
var apiAdapter = require("./apiAdapter");


var client = rest
    .wrap(timeout, { timeout: 10e3 })   // 10 seconds
    .wrap(mime, { mime: "application/vnd.api+json" })
    .wrap(pathPrefix, { prefix: "http://localhost:4000" }); // TODO: Get from config


function loadCmsPage(url) {
    // Attempt to load the page from the API
    return Q(client({
        path: "/api/page",
        params: { "filter[url]=": url, include: "regions.content" }
    }));
}

var routes = {};

// Check to see if this page exists in the API
routes.cmsPage = function(req, res, next) {
    // Ensure we are not api url
    if (!/^(?!\/api).*/.test(req.path)) {
        return next();
    }

    // TODO: List of other paths to ignore? assets etc
    loadCmsPage(req.path).then(function(response) {
        // Page not found
        if (!response.entity.data.length) {
            return next();
        }

        if (req.query.raw) {
            return res.send(response.entity);
        }

        var page = apiAdapter.page(response);

        return res.render("templates/page/" + page.template, { page: page });
    }).catch(function(response) {
        // API error
        next(response.entity);
    });
};

routes.middleware = function(options) {
    return function(app, cms) {
        app.use(routes.cmsPage);
    };
};

module.exports = routes;
