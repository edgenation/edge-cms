var api = require("./api/app");
var cms = require("./site/app");

var app = cms.createApp();
api.useApp(app);

api.connectDB()
    .then(function () {
        cms.startServer();
    })
    .fail(function (err) {
        console.error("Fatal Error:", err);
        api.disconnectDB();
    });
