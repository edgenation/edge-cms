var api = require("./api/app");
var CMS = require("./site/app");
var errorHandler = require("./site/errorHandler");
var cmsRouter = require("./site/cmsRouter");

module.exports = {
    api: api,
    CMS: CMS,
    errorHandler: errorHandler,
    cmsRouter: cmsRouter
};
