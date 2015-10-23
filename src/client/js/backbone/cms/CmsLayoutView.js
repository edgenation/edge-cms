var Marionette = require("backbone.marionette");

var template = require("./layout-template.jade");

var CmsLayoutView = Marionette.LayoutView.extend({
    el: 'body',
    template: template,

    regions: {
        header: '.CmsHeader',
        content: '.CmsContent'
    }
});

module.exports = CmsLayoutView;
