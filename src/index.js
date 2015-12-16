var _ = require("lodash");
var requireDir = require("require-dir");

module.exports = _.assign({}, requireDir("./site"), requireDir("./site/middleware"), requireDir("./api"));
