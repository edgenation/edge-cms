var Marionette = require("backbone.marionette");

var PageRouter = require("./PageRouter");

var PageModule = Marionette.Module.extend({
    startWithParent: false,

    initialize: function() {
        this.app.page = new PageRouter({
            container: this.app.layout.content
        });
    }
});

module.exports = PageModule;
