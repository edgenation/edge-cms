var Marionette = require("backbone.marionette");

var template = require("./page.jade");

var PageView = Marionette.ItemView.extend({
    template: template,
    className: "page"
});

module.exports = PageView;
