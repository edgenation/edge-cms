var Marionette = require("backbone.marionette");

var IndexRouter = require("./IndexRouter");

var IndexModule = Marionette.Module.extend({
    startWithParent: false,

    initialize: function() {
        console.log("IndexModule::initialize");

        this.app.index = new IndexRouter({
            container: this.app.layout.content
        });
    },

    onStart: function () {
        console.log("IndexModule::onStart");
    }
});

module.exports = IndexModule;
