(function() {
  var CMS, MultiViews, express;

  express = require("express");

  MultiViews = require("./multi-views");

  CMS = (function() {
    function CMS() {}

    CMS.prototype.setConfig = function(config) {
      this.config = config;
    };

    CMS.prototype.setApp = function(app) {
      this.app = app;
      MultiViews(this.app);
      this.app.set("views", [this.config.get("views"), "" + __dirname + "/../views"]);
      this.app.use(express["static"]("/admin/assets", "" + __dirname + "/../public"));
      return this.app.use(require("../route/admin/auth"));
    };

    CMS.prototype.use = function(middleware) {
      return middleware(this);
    };

    return CMS;

  })();

  module.exports = CMS;

}).call(this);
