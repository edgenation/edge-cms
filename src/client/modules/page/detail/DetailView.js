var $ = require("jquery");
var Marionette = require("backbone.marionette");

var template = require("./detail.jade");


var DetailView = Marionette.ItemView.extend({
    template: template,

    events: {
        "submit form": "onSave"
    },

    modelEvents: {
        "sync": "render"
    },

    onShow: function () {
        this.model.fetch({ data: { include: "regions.content" }});
    },

    onSave: function (e) {
        e.preventDefault();
        var changes = $('form').serializeArray();

        for (var n = 0, m = changes.length; n < m; n++) {
            this.model.set(changes[n].name, changes[n].value);
        }

        this.model.save();
    }
});

module.exports = DetailView;
