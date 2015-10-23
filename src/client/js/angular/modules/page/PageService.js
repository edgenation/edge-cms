var _ = require("lodash");
var angular = require("angular");

var app = angular.module("cmsAdmin");

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

function apiToModel(response) {
    var data;
    var included = response.included;

    if (_.isArray(response.data)) {
        data = _.map(response.data, function(responseData) {
            var d = responseData.attributes;
            d.id = responseData.id;
            addIncludedData(d, included);
            return d;
        });
    } else {
        data = response.data.attributes;
        data.id = response.data.id;
        addIncludedData(data, included);
    }

    console.log(data);
    return data;
}

function modelToApi(data) {
    var attributes = {};

    _.forEach(data, function(val, attr) {
        if (_.isArray(val) || attr.indexOf("$") === 0 || attr === "id" || attr === "type") {
            return;
        }

        attributes[attr] = val;
    });

    return {
        data: {
            attributes: attributes
        }
    };
}


app.factory('Page', ["$resource", function($resource) {
    return $resource('/api/page/:id', {}, {
        query: {
            method: 'GET',
            isArray: true,
            params: { include: "regions.content" },
            transformResponse: function(data, headers) {
                return apiToModel(JSON.parse(data));
            }
        },

        get: {
            method: 'GET',
            params: { include: "regions.content" },
            transformResponse: function(data, headers) {
                return apiToModel(JSON.parse(data));
            }
        },

        update: {
            method: 'PUT',
            params: { id: '@id', include: "regions.content" },
            transformRequest: function(data, headers) {
                return JSON.stringify(modelToApi(data));
            }
        }
    });
}]);

