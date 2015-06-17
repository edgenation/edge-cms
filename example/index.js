var edgeCMS = require("../src");

var config = edgeCMS.config(__dirname + "/config");
var cms = new edgeCMS.site();

// Set a logger
//cms.set("log", edgeCMS.logger);

// Create the CMS app
cms.createApp({
    port: config.get("port"),
    host: config.get("host")
});

// Add our client views
cms.modify("views", function(views) {
    views.unshift(__dirname + "/view");
});

// Add error handlers
cms.use(edgeCMS.errorHandler());

// Add the cms API - can be a different app
cms.use(edgeCMS.api.middleware());

// Add cms routing
cms.use(edgeCMS.router());


// Connect to the database
edgeCMS.api.connectDB(config.get("database"))
    .then(function () {
        cms.startServer();
    })
    .fail(function (err) {
        console.error("Fatal Error:", err);
        edgeCMS.api.disconnectDB();
    });
