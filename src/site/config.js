var path = require("path");
var convict = require("convict");


var Config = function (configDirectory) {
    // Define schema
    var config = convict({
        env: {
            doc: "The application environment.",
            format: ["production", "development", "test"],
            default: "development",
            env: "NODE_ENV"
        },
        port: {
            doc: "The port to bind.",
            format: "port",
            default: 4000,
            env: "PORT"
        },
        host: {
            doc: "The host to bind.",
            format: "ipaddress",
            default: "0.0.0.0",
            env: "HOST"
        },
        database: {
            doc: "The mongodb database URL.",
            format: String,
            default: "mongodb://127.0.0.1/edge-cms",
            env: "MONGO_URL"
        },
        name: {
            doc: "The application name.",
            format: String,
            default: "EdgeCMS"
        },
        "cookie-secret-key": {
            doc: "A secret key for cookies.",
            format: String,
            default: "edge-cms-secret-key"
        }
    });

    // Load environment dependent configuration
    var env = config.get("env");
    config.loadFile(path.resolve(configDirectory, env + ".json"));

    // Perform validation
    config.validate();

    return config;
};


module.exports = Config;
