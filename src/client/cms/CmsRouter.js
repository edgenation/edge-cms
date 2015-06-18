var Marionette = require("backbone.marionette");
var Wreqr = require("backbone.wreqr");

var routerChannel = Wreqr.radio.channel("global");

var CmsRouter = Marionette.AppRouter.extend({
    appRoutes: {},
    controller: {},

    onRoute: function(name, path, args) {
        routerChannel.vent.trigger("route:onRoute", name);
    }
});

module.exports = CmsRouter;
