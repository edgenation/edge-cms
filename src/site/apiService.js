"use strict";

const Promise = require("bluebird");
const rest = require("rest");
const mime = require("rest/interceptor/mime");
const pathPrefix = require("rest/interceptor/pathPrefix");
const timeout = require("rest/interceptor/timeout");

/**
 * @namespace
 */
var apiService = {};

apiService.client = rest;


/**
 * @param {string} apiUri
 */
apiService.init = function (apiUri) {
    apiService.client = apiService.client
        .wrap(timeout, { timeout: 10e3 })   // 10 seconds
        .wrap(mime, { mime: "application/vnd.api+json" })
        .wrap(pathPrefix, { prefix: apiUri });
};


/**
 * @param {string} path
 * @param {Object} params
 * @returns {Promise.<*>}
 */
apiService.load = function (path, params) {
    return Promise.resolve(apiService.client({
        path,
        params
    })).then((response) => {
        let debug = response.entity.debug || [];
        debug.push({ path: response.raw.request.path });
        response.entity.debug = debug;
        return response.entity;
    });
};


/**
 * @param {string} url
 * @returns {Promise.<*>}
 */
apiService.loadPage = function (url) {
    return apiService.load("/page", {
        "filter[url]=": url,
        include: "regions.content"
    })
};


/**
 * @param {string|number} id - A mongodb id
 * @param {string} sort
 * @returns {Promise.<*>}
 */
apiService.loadPageListPages = function (id, sort) {
    return apiService.load(`/page-list/${id}/pages`, {
        include: "regions.content",
        sort
    });
};


/**
 * @param {string} url
 * @param {string} sort
 * @returns {Promise.<*>}
 */
apiService.loadPageList = function (url, sort) {
    return apiService.load("/page-list", {
        "filter[url]=": url,
        fields: "id"
    }).then(function (response) {
        let lists = response.data;

        if (lists.length === 1) {
            return apiService.loadPageListPages(lists[0].id, sort);
        }

        return false;
    });
};


module.exports = apiService;
