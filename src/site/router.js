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

function flattenAttributes(data) {
    _.forEach(data.attributes, function(value, name) {
        data[name] = value;
    });

    delete data.attributes;
}

function nestIncluded(data, included) {
    _.forEach(data, function(id, index, content) {
        content[index] = _.find(included, function(include) {
            return include.id === id;
        });

        flattenAttributes(content[index]);
    });
}

function apiPageAdapter(response) {
    var page = response.entity.data[0];

    flattenAttributes(page);

    // Nest the regions
    nestIncluded(page.regions, response.entity.included);

    // Nest the region contents
    _.forEach(page.regions, function(regionId, regionIndex, regions) {
        nestIncluded(regions[regionIndex].content, response.entity.included);
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

            var page = apiPageAdapter(response);

            res.render("templates/page/" + page.template, { page: page });
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
