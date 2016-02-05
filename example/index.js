var edgeCMS = require("../src");
var staticRoute = require("./route/static");
var homepageRoute = require("./route/homepage");
var blogRoute = require("./route/blog");

var config = edgeCMS.config(__dirname + "/config");
var cms = new edgeCMS.site();

// Set a logger
//cms.set("log", edgeCMS.logger);

// Create the CMS app
cms.createApp({
    port: config.get("app.port"),
    host: config.get("app.host")
});

// Add our client views
cms.modify("views", function(views) {
    views.unshift(__dirname + "/view");
});

// Add error handlers
cms.use(edgeCMS.errorHandler.middleware());

// Initialize the cms api service
edgeCMS.apiService.init(config.get("api.uri"));

// Add the cms API - can be a different app
cms.use(edgeCMS.api.middleware({ path: config.get("api.path") }));

// Add cms admin
cms.use(edgeCMS.admin.middleware({ path: "/admin" }));

// Add custom routes
cms.use(homepageRoute);
cms.use(blogRoute);
cms.use(staticRoute);

// Add cms routing
cms.use(edgeCMS.cmsRoutes.middleware({
    skipRoutes: [
        /^\/api(\/|^\/+)/,
        /^\/favicon.ico$/
    ]
}));


// Connect to the database
edgeCMS.api.connectDB(config.get("database.uri"))
    .then(function () {
        cms.startServer(function () {
            console.log("CMS Server started: http://" + config.get("app.host") + ":" + config.get("app.port"));
            console.log("API Server started: " + config.get("api.uri"));
        });
    })
    .catch(function (err) {
        console.error("Fatal Error:", err);
        edgeCMS.api.disconnectDB();
        process.exit(1);
    });
