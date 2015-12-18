"use strict";

// This is an example of a static route that is not linked to the CMS routes
module.exports = function (app, cms) {
    app.get("/static", function (req, res) {
        res.send("Normal static express route");
    });
};
