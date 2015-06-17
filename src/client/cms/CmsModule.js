var _ = require("lodash");
var Backbone = require("backbone");
var Marionette = require("backbone.marionette");

var CmsRouter = require("./CmsRouter");


var CmsModule = Marionette.Module.extend({
    onBeforeStart: function () {
        this.app.router = new CmsRouter({ vent: this.app.vent });

        // Load all the modules
        var modules = require("../modules/*/*Module.js", { mode: "hash" });
        _.forEach(modules, function (module, moduleName) {
            this.app.module("CmsModule." + moduleName, module);
        }, this);
    },

    onStart: function () {
        if (Backbone.history) {
            Backbone.history.start({
                pushState: true,
                hashChange: false
            });
        }
    }
});

module.exports = CmsModule;
