var Backbone = require("backbone");
var Marionette = require("backbone.marionette");

var CmsLayoutView = require("./CmsLayoutView");

var CmsApplication = Marionette.Application.extend({
    initialize: function () {
        this.layout = new CmsLayoutView();
        this.layout.render();
    }
});

module.exports = CmsApplication;
