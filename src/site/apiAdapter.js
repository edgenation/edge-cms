"use strict";

const _ = require("lodash");

/**
 * @namespace
 */
var apiAdapter = {};


/**
 * @param {Object} data
 */
apiAdapter.flattenAttributes = function (data) {
    _.forEach(data.attributes, function(value, name) {
        data[name] = value;
    });

    delete data.attributes;
};


/**
 * @param {Array} data
 * @param {Array} included
 */
apiAdapter.nestIncluded = function(data, included) {
    if (!data || !data.length) {
        return;
    }

    _.forEach(data, function(id, index, content) {
        content[index] = included.find(include => (include.id === id));

        if (content[index]) {
            apiAdapter.flattenAttributes(content[index]);
        }
    });

    // Remove any items that were not found
    _.remove(data, _.isUndefined);
};


/**
 * @param {Object} response
 * @returns {boolean|Object}
 */
apiAdapter.page = function(response) {
    if (!response || !response.data.length) {
        return false;
    }

    let page = response.data[0];

    apiAdapter.flattenAttributes(page);

    // Nest the regions
    if (page.regions && response.included) {
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


/**
 * @param {Object} response
 * @returns {boolean|Object}
 */
apiAdapter.pageList = function(response) {
    if (!response || !response.data.length) {
        return false;
    }

    let list = response.data;

    // Nest the page regions
    _.forEach(list, function (page) {
        apiAdapter.flattenAttributes(page);

        // Nest the page regions
        if (page.regions && response.included) {
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


/**
 * @param {Object} response
 * @returns {boolean|Object}
 */
apiAdapter.pagination = function (response) {
    if (!response || !response.meta.page) {
        return false;
    }

    let pagination = {
        offset: response.meta.page.offset,
        total: response.meta.page.total,
        limit: response.meta.page.limit
    };

    pagination.page = Math.ceil(pagination.offset / pagination.limit) || 1;
    pagination.pages = Math.ceil(pagination.total / pagination.limit);

    return pagination;
};


module.exports = apiAdapter;
