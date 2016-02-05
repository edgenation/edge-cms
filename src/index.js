const requireDir = require("require-dir");

module.exports = Object.assign({}, requireDir("./site"), requireDir("./site/middleware"), requireDir("./api"));
