"use strict";

var Promise = require("bluebird");
var rest = require("rest");
var mime = require("rest/interceptor/mime");
var pathPrefix = require("rest/interceptor/pathPrefix");
var timeout = require("rest/interceptor/timeout");

var apiService = {};

apiService.client = rest;


apiService.init = function (apiUri) {
    apiService.client = apiService.client
        .wrap(timeout, { timeout: 10e3 })   // 10 seconds
        .wrap(mime, { mime: "application/vnd.api+json" })
        .wrap(pathPrefix, { prefix: apiUri });
};


apiService.load = function (path, params) {
    return Promise.resolve(apiService.client({
        path: path,
        params: params
    })).then((response) => {
        let debug = response.entity.debug || [];
        debug.push({ path: response.raw.request.path });
        response.entity.debug = debug;
        return response.entity;
    });
};

apiService.loadPage = function (url) {
    return apiService.load("/page", {
        "filter[url]=": url,
        include: "regions.content"
    })
};

apiService.loadPageListPages = function (id, sort) {
    return apiService.load(`/page-list/${id}/pages`, {
        include: "regions.content",
        sort
    });
};


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
