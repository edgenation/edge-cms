var disabledCache = "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0";


var errorHandler = function (options) {
    return {
        init: function (app, cms) {
            cms.log("info", "Enabling error handlers");

            cms.set("404", function (req, res, next) {
                // Don't cache 404s
                res.set({"Cache-Control": disabledCache});
                res.render("error/404", {url: req.url});
            });

            cms.set("500", function (err, req, res, next) {
                cms.log("error", err);
                // Don't cache 500s
                res.set({"Cache-Control": disabledCache});
                res.render("error/500", {error: err});
            });
        }
    };
};

module.exports = errorHandler;
