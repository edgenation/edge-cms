var Q = require("q");
var _ = require("lodash");
var rest = require("rest");
var mime = require("rest/interceptor/mime");
var pathPrefix = require("rest/interceptor/pathPrefix");
var timeout = require("rest/interceptor/timeout");


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

function apiPageAdapter(response) {
    var page = response.entity.data[0];

    _.forEach(page.attributes.regions, function(regionId, n, regions) {
        regions[n] = _.find(response.entity.included, function(include) {
            return include.id === regionId;
        });

        _.forEach(regions[n].attributes.content, function(contentId, n, content) {
            content[n] = _.find(response.entity.included, function(include) {
                return include.id === contentId;
            });
        });
    });

    return page;
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

            if (req.query.raw) {
                return res.send(response.entity);
            }

            res.render("page", { page: apiPageAdapter(response) });
        }).fail(function(response) {
            // API error
            next(response.entity);
        });
    };
}

module.exports = function (options) {
    return {
        init: function(app, cms) {
            app.use(cmsRouter());
        }
    }
};
