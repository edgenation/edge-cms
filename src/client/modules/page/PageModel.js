var Backbone = require("backbone");

var PageModel = Backbone.Model.extend({
    urlRoot: "/api/page",

    initialize: function() {
    },

    parse: function(response, options) {
        if (!options.collection) {
            response = response.data;
        }

        var data = response.attributes;
        data.id = response.id;
        return data;
    }
});

module.exports = PageModel;
