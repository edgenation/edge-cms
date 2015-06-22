var Marionette = require("backbone.marionette");

var PageCollection = require("./../PageCollection");
var template = require("./page.jade");
var childTemplate = require("./pageItem.jade");


var PageItemView = Marionette.ItemView.extend({
    template: childTemplate,
    className: "pageItem",
    tagName: "li"
});

var PageView = Marionette.CompositeView.extend({
    template: template,
    childView: PageItemView,
    childViewContainer: ".pages",
    className: "page",

    initialize: function () {
        this.collection = new PageCollection();
    },

    onShow: function () {
        this.collection.fetch();
    }
});

module.exports = PageView;
