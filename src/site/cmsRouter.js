var Q = require("q");
var rest = require("rest");
var mime = require("rest/interceptor/mime");
var pathPrefix = require("rest/interceptor/pathPrefix");
var timeout = require("rest/interceptor/timeout");


var client = rest
    .wrap(timeout, { timeout: 10e3 })   // 10 seconds
    .wrap(mime, { mime: "application/vnd.api+json" })
    .wrap(pathPrefix, { prefix: "http://localhost:4000" });


function loadCmsPage(url) {
    // Attempt to load the page from the API
    return Q(client({
        path: "/api/page",
        params: { "filter[url]=": url }
    }));
}

// Check to see if this page exists in the API
function cmsRouter(options) {
    return function cmsRouter(req, res, next) {
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

            // TODO: Send the response - render template etc
            res.send(response.entity);
        }).fail(function(response) {
            // API error
            next(response.entity);
        });
    };
}

module.exports = cmsRouter;
