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
    })).then(function (response) {
        return response.entity;
    });
};

apiService.loadPage = function (url) {
    return apiService.load("/page", {
        "filter[url]=": url,
        include: "regions.content"
    })
};

apiService.loadPageListPages = function (id) {
    return apiService.load("/page-list/" + id + "/pages", {
        include: "regions.content"
    });
};


apiService.loadPageList = function (url) {
    return apiService.load("/page-list", {
        "filter[url]=": url,
        fields: "id"
    }).then(function (response) {
        var lists = response.data;

        if (lists.length === 1) {
            return apiService.loadPageListPages(lists[0].id);
        }

        return false;
    });
};

module.exports = apiService;
