var Routing = require("backbone-routing");

var PageModel = require("../PageModel");
var DetailView = require("./DetailView");

var DetailRoute = Routing.Route.extend({
    initialize: function(options) {
        options = options || {};
        this.container = options.container;
    },

    render: function(id) {
        this.view = new DetailView({
            model: new PageModel({ id: id })
        });

        this.container.show(this.view);
    }
});

module.exports = DetailRoute;
