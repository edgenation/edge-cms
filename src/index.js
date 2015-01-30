var api = require("./app/api");
var cms = require("./app/cms");

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
