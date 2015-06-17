var Marionette = require("backbone.marionette");

var CmsRouter = Marionette.AppRouter.extend({
    appRoutes: {},
    controller: {},

    onRoute: function(name, path, args) {
        this.options.vent.trigger("route:onRoute", name);
    }
});

module.exports = CmsRouter;
