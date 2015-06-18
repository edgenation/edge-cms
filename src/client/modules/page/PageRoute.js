var Routing = require("backbone-routing");

var PageView = require("./PageView");

var PageRoute = Routing.Route.extend({
    initialize: function(options) {
        console.log("PageRoute::initialize");
        options = options || {};
        this.container = options.container;
    },

    render: function() {
        console.log("PageRoute::render");
        this.view = new PageView();
        this.container.show(this.view);
    }
});

module.exports = PageRoute;
