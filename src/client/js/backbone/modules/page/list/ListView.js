var Marionette = require("backbone.marionette");

var template = require("./list.jade");
var listItemTemplate = require("./listItem.jade");


var ListItemView = Marionette.ItemView.extend({
    template: listItemTemplate,
    tagName: "li"
});

var ListView = Marionette.CompositeView.extend({
    template: template,
    childView: ListItemView,
    childViewContainer: ".pages",

    initialize: function () {
    },

    onShow: function () {
        this.collection.fetch();
    }
});

module.exports = ListView;
