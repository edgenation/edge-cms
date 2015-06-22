var Routing = require("backbone-routing");

var ListRoute = require("./list/ListRoute");
var DetailRoute = require("./detail/DetailRoute");

var PageRouter = Routing.Router.extend({
    initialize: function (options) {
        options = options || {};
        this.container = options.container;
    },

    routes: {
        "page": "list",
        "page/:id": "detail"
    },

    list: function () {
        return new ListRoute({ container: this.container });
    },

    detail: function () {
        return new DetailRoute({ container: this.container });
    }
});

module.exports = PageRouter;
