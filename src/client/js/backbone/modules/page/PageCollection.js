var Backbone = require("backbone");
var PageModel = require("./PageModel");

var PageCollection = Backbone.Collection.extend({
    model: PageModel,
    url: "/api/page",

    parse: function(response) {
        return response.data;
    }
});

module.exports = PageCollection;
