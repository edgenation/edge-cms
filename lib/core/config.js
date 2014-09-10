(function() {
  var convict, path;

  path = require("path");

  convict = require("convict");

  module.exports = function(configDirectory) {
    var conf, env;
    conf = convict({
      env: {
        doc: "The applicaton environment.",
        format: ["production", "development", "test"],
        "default": "development",
        env: "NODE_ENV"
      },
      port: {
        doc: "The port to bind.",
        format: "port",
        "default": 3000,
        env: "PORT"
      },
      database: {
        url: {
          doc: "The mongodb database URL.",
          format: String,
          "default": "mongodb://127.0.0.1/edge-cms-example",
          env: "MONGO_URL"
        }
      },
      name: {
        doc: "The application name",
        format: String,
        "default": "EdgeCMS"
      }
    });
    env = conf.get("env");
    conf.loadFile(path.resolve(configDirectory, "" + env + ".json"));
    conf.validate();
    return conf;
  };

}).call(this);
