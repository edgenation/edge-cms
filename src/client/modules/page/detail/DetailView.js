var Marionette = require("backbone.marionette");

var template = require("./detail.jade");


var DetailView = Marionette.ItemView.extend({
    template: template,

    modelEvents: {
        "sync": "render"
    },

    initialize: function () {
    },

    onShow: function () {
        this.model.fetch();
    }
});

module.exports = DetailView;
