var _ = require("lodash");
var Backbone = require("backbone");
var Marionette = require("backbone.marionette");


var CmsModule = Marionette.Module.extend({
    onBeforeStart: function () {
        // Load all the modules
        var modules = require("../modules/*/*Module.js", { mode: "hash" });
        _.forEach(modules, function (module, moduleName) {
            this.app.module("EdgeCMS." + moduleName, module);
        }, this);
    },

    onStart: function () {
        if (Backbone.history) {
            Backbone.history.start({
                pushState: true,
                hashChange: false,

                // TODO: Get from data attribute
                root: "/admin"
            });
        }
    }
});

module.exports = CmsModule;
