var Marionette = require("backbone.marionette");

var PageRouter = require("./PageRouter");

var PageModule = Marionette.Module.extend({
    startWithParent: false,

    initialize: function() {
        console.log("PageModule::initialize");

        this.app.page = new PageRouter({
            container: this.app.layout.content
        });
    },

    onStart: function () {
        console.log("PageModule::onStart");
    }
});

module.exports = PageModule;
