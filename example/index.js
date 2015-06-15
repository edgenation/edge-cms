var edgeCms = require("../src");

// Create the CMS app
var app = edgeCms.cms.createApp({
    port: process.env.PORT,
    host: process.env.HOST
});

// Apply the CMS API
edgeCms.api.useApp(app);

// Connect to the database
edgeCms.api.connectDB("mongodb://localhost/edge-cms-prototype")
    .then(function () {
        edgeCms.cms.startServer();
    })
    .fail(function (err) {
        console.error("Fatal Error:", err);
        edgeCms.api.disconnectDB();
    });
