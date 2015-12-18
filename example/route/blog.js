var Promise = require("bluebird");
var apiService = require("../../src/").apiService;
var apiAdapter = require("../../src/").apiAdapter;


module.exports = function (app, cms) {

    app.get("/blog", function (req, res, next) {
        //console.log("app.get"); // TODO: Getting called twice!?

        Promise.join(apiService.loadPage(req.path), apiService.loadPageList(req.path), function (pageResponse, pageListResponse) {
            // Page not found
            if (!pageResponse || !pageResponse.data.length) {
                return next();
            }

            var page = apiAdapter.page(pageResponse);
            var posts = apiAdapter.pageList(pageListResponse);

            //console.log(JSON.stringify(posts, null, 4));

            if (req.query.json) {
                return res.json({
                    page: page,
                    posts: posts
                });
            }

            return res.render("templates/page/" + page.template, { page: page, posts: posts });
        }).catch(next);

    });

};
