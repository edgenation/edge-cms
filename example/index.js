var edgeCMS = require("../src");

var cms = new edgeCMS.CMS();

// Set a logger
//cms.set("log", edgeCMS.logger);

// Create the CMS app
cms.createApp({
    port: process.env.PORT || 4000,
    host: process.env.HOST || "0.0.0.0"
});

// Add our client views
cms.modify("views", function(views) {
    views.unshift(__dirname + "/view");
});

// Add error handlers
cms.use(edgeCMS.errorHandler());

// Add cms routing
cms.use(edgeCMS.cmsRouter());


// Apply the CMS API
edgeCMS.api.useApp(cms.app);

// Connect to the database
edgeCMS.api.connectDB(process.env.MONGO_URL || "mongodb://localhost/edge-cms-prototype")
    .then(function () {
        cms.startServer();
    })
    .fail(function (err) {
        console.error("Fatal Error:", err);
        edgeCMS.api.disconnectDB();
    });
