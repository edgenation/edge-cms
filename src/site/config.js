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
            host: {
                doc: "Database host name/IP",
                format: String,
                default: "127.0.0.1",
                env: "HOST_GATEWAY_IP"
            },
            name: {
                doc: "Database name",
                format: String,
                default: "edge-cms"
            },
            port: {
                doc: "Database port",
                format: "port",
                default: 27017
            }
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
