var _ = require("lodash");
var Backbone = require("backbone");

function addIncludedData(data, included) {
    if (!included) {
        return;
    }

    _.forEach(data, function(val, attr) {
        if (_.isArray(val) && _.every(val, _.isString)) {
            var attrName = attr.replace(/s$/, "");

            // Attempt to look up in includes
            data[attr] = _.chain(included)
                .filter({ type: attrName })
                .map(function(include) {
                    var inc = include.attributes;
                    inc.id = include.id;

                    addIncludedData(inc, included);

                    return inc;
                })
                .value();
        }
    });
}

var PageModel = Backbone.Model.extend({
    urlRoot: "/api/page",

    save: function(attributes, options) {
        // cleanup attributes before saving
        var attrs = this.encode(attributes || this.attributes);
        options = options || {};
        //options.contentType = "application/json";
        options.attrs = attrs;
        options.queryParams = { include: "regions.content" };
        return Backbone.Model.prototype.save.call(this, attrs, options);
    },

    encode: function(attrs) {
        var attributes = {};

        _.forEach(attrs, function(val, attr) {
            if (_.isArray(val) || attr === "id" || attr === "type") {
                return;
            }

            attributes[attr] = val;
        });

        console.log(attributes);

        return {
            data: {
                attributes: attributes
            }
        };
    },

    parse: function(response, options) {
        console.info("Parse", response);
        var included;

        if (!options.collection) {
            included = response.included;
            response = response.data;
        }

        var data = response.attributes;
        data.id = response.id;

        addIncludedData(data, included);

        console.log("Parsed Data", data);
        return data;
    }
});

module.exports = PageModel;
