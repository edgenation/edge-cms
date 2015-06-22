var Backbone = require("backbone");

var PageModel = Backbone.Model.extend({
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

module.exports = PageModel;
