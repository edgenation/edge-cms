"use strict";

var _ = require("lodash");

var apiAdapter = {};

apiAdapter.flattenAttributes = function (data) {
    _.forEach(data.attributes, function(value, name) {
        data[name] = value;
    });

    delete data.attributes;
};

apiAdapter.nestIncluded = function(data, included) {
    if (!data || !data.length) {
        return;
    }

    _.forEach(data, function(id, index, content) {
        content[index] = _.find(included, include => (include.id === id));

        if (content[index]) {
            apiAdapter.flattenAttributes(content[index]);
        }
    });

    // Remove any items that were not found
    _.remove(data, _.isUndefined);
};

apiAdapter.page = function(response) {
    if (!response || !response.data.length) {
        return false;
    }

    let page = response.data[0];

    apiAdapter.flattenAttributes(page);

    // Nest the regions
    if (page.regions && page.included) {
        apiAdapter.nestIncluded(page.regions, response.included);
    }

    // Nest the region contents
    if (page.regions) {
        _.forEach(page.regions, function (regionId, regionIndex, regions) {
            apiAdapter.nestIncluded(regions[regionIndex].content, response.included);
        });
    }

    return page;
};

apiAdapter.pageList = function(response) {
    if (!response || !response.data.length) {
        return false;
    }

    let list = response.data;

    // Nest the page regions
    _.forEach(list, function (page, n) {
        apiAdapter.flattenAttributes(page);

        // Nest the page regions
        if (page.regions && page.included) {
            apiAdapter.nestIncluded(page.regions, response.included);
        }

        // Nest the region contents
        if (page.regions) {
            _.forEach(page.regions, function (regionId, regionIndex, regions) {
                apiAdapter.nestIncluded(regions[regionIndex].content, response.included);
            });
        }
    });

    return list;
};

apiAdapter.pagination = function (response) {
    if (!response || !response.meta.page) {
        return false;
    }

    let pagination = {
        offset: response.meta.page.offset,
        total: response.meta.page.total,
        limit: response.meta.page.limit,
    };

    pagination.page = Math.ceil(pagination.offset / pagination.limit) || 1;
    pagination.pages = Math.ceil(pagination.total / pagination.limit);

    return pagination;
};


module.exports = apiAdapter;
