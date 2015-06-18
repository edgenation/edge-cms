var Marionette = require("backbone.marionette");

var template = require("./index.jade");

var IndexView = Marionette.ItemView.extend({
    template: template,
    className: "index"
});

module.exports = IndexView;
