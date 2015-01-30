var Q = require("q"),
    mongoose = require("mongoose"),
    express = require("express"),
    compression = require("compression"),
    bodyParser = require("body-parser"),
    helmet = require("helmet"),
    methodOverride = require("method-override"),
    responseTime = require("response-time"),
    cookieParser = require("cookie-parser");


// Connect to database
Q.ninvoke(mongoose, "connect", "mongodb://localhost/edge-cms-prototype")
    .then(function () {
        console.log("Connected to DB");

        // Create express server
        var app = express();
        app.use(compression());
        app.use(bodyParser.urlencoded({extended: true}));
        app.use(bodyParser.json());
        app.use(methodOverride());
        app.use(responseTime());
        app.use(helmet());

        // Add routes
        app.use("/api", require("./route/api"));

        // Start server
        var port = process.env.PORT || 3000;
        var host = "0.0.0.0";

        app.listen(port, host, function () {
            console.log("Server started: http://" + this.address().address + ":" + this.address().port);
        });
    })
    .fail(function (err) {
        console.error("Fatal Error:", err);
        mongoose.disconnect();
    });
