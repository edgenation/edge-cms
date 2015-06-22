var Routing = require("backbone-routing");

var PageRoute = require("./PageRoute");

var PageRouter = Routing.Router.extend({
    initialize: function (options) {
        console.log("PageRouter::initialize");
        options = options || {};
        this.container = options.container;
    },

    routes: {
        "page": "page",
        //"page/:id": "page"
    },

    page: function () {
        console.log("PageRouter::index");
        return new PageRoute({ container: this.container });
    }
});

module.exports = PageRouter;
