var Routing = require("backbone-routing");

var IndexRoute = require("./IndexRoute");

var IndexRouter = Routing.Router.extend({
    initialize: function (options) {
        console.log("IndexRouter::initialize");
        options = options || {};
        this.container = options.container;
    },

    routes: {
        "": "index"
    },

    index: function () {
        console.log("IndexRouter::index");
        return new IndexRoute({ container: this.container });
    }
});

module.exports = IndexRouter;
