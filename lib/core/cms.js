(function() {
  var CMS, Log, express;

  express = require("express");

  Log = require("./log");

  CMS = (function() {
    function CMS(config) {
      this.config = config;
    }

    CMS.prototype.init = function(app) {
      this.app = app;
      if (!this.app) {
        return this.createApp();
      }
    };

    CMS.prototype.createApp = function() {
      return this.app = express();
    };

    CMS.prototype.start = function() {
      var server;
      return server = this.app.listen(3000, function() {
        return Log.success("Listening on port " + server.address().port);
      });
    };

    CMS.prototype.use = function(middleware) {
      return middleware(this);
    };

    CMS.prototype.configure = function() {};

    return CMS;

  })();

  module.exports = CMS;

}).call(this);
