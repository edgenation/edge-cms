var Routing = require("backbone-routing");

var IndexView = require("./IndexView");

var IndexRoute = Routing.Route.extend({
    initialize: function(options) {
        console.log("IndexRoute::initialize");
        options = options || {};
        this.container = options.container;
    },

    render: function() {
        console.log("IndexRoute::render");
        this.view = new IndexView();
        this.container.show(this.view);
    }
});

module.exports = IndexRoute;
