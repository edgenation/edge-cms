"use strict";

// This is an example of adding additional functionality to a cms route
module.exports = function (app, cms) {

    // This is run before the cms routes so we can do additional logic here
    // If we still want the cms route to run we need to call next()
    app.get("/", function (req, res, next) {
        // We can send some additional data to the cms views via res.locals
        res.locals.customContent = {
            type: "html",
            data: {
                html: "<p>Test <strong>" + Date.now() + "</strong></p>"
            }
        };

        next();
    });

};
