var Backbone = require("backbone");

var Marionette = require("backbone.marionette");

var template = require("./page.jade");
var childTemplate = require("./pageItem.jade");



var Page = Backbone.Model.extend({
    urlRoot: "/api/page",

    initialize: function() {
    },

    parse: function(response, options) {
        console.log(options);
        //var data = response.data.attributes;
        //data.id = response.data.id;

        var data = response.attributes;
        data.id = response.id;
        return data;
    }
});

var Pages = Backbone.Collection.extend({
    model: Page,
    url: "/api/page",

    parse: function(response) {
        return response.data;
    }
});



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
        this.collection = new Pages();
    },

    onShow: function () {
        this.collection.fetch();
    }
});

module.exports = PageView;
