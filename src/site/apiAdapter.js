var _ = require("lodash");

var apiAdapter = {};

apiAdapter.flattenAttributes = function (data) {
    _.forEach(data.attributes, function(value, name) {
        data[name] = value;
    });

    delete data.attributes;
};

apiAdapter.nestIncluded = function(data, included) {
    _.forEach(data, function(id, index, content) {
        content[index] = _.find(included, function(include) {
            return include.id === id;
        });

        apiAdapter.flattenAttributes(content[index]);
    });
};

apiAdapter.page = function(response) {
    var page = response.entity.data[0];

    apiAdapter.flattenAttributes(page);

    // Nest the regions
    apiAdapter.nestIncluded(page.regions, response.entity.included);

    // Nest the region contents
    _.forEach(page.regions, function(regionId, regionIndex, regions) {
        apiAdapter.nestIncluded(regions[regionIndex].content, response.entity.included);
    });

    return page;
};


module.exports = apiAdapter;
