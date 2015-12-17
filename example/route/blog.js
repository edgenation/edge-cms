var Promise = require("bluebird");
var apiService = require("../../src/").apiService;
var apiAdapter = require("../../src/").apiAdapter;


module.exports = function (app, cms) {

    app.get("/blog", function (req, res, next) {
        //console.log("app.get"); // TODO: Getting called twice!?

        Promise.join(apiService.loadPage(req.path), apiService.loadPageList(req.path), function (pageResponse, pageListResponse) {
            // Page not found
            if (!pageResponse.entity.data.length) {
                return next();
            }

            var page = apiAdapter.pageList(pageResponse);
            var list = apiAdapter.pageList(pageListResponse);

            return res.render("templates/page/" + page.template, { page: page, list: list });
        }).catch(function (response) {
            // API error
            next(response.entity || response);
        });

    });

};
