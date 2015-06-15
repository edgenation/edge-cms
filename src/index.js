var api = require("./api/app");
var site = require("./site/app");
var errorHandler = require("./site/errorHandler");
var router = require("./site/router");
var config = require("./site/config");

module.exports = {
    api: api,
    site: site,
    errorHandler: errorHandler,
    router: router,
    config: config
};
