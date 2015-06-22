var Routing = require("backbone-routing");

var PageCollection = require("../PageCollection");
var ListView = require("./ListView");

var ListRoute = Routing.Route.extend({
    initialize: function(options) {
        console.log("ListRoute::initialize");
        options = options || {};
        this.container = options.container;
    },

    render: function() {
        console.log("ListRoute::render");
        this.view = new ListView({
            collection: new PageCollection()
        });

        this.container.show(this.view);
    }
});

module.exports = ListRoute;
