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
        app: {
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
        },
        api: {
            port: {
                doc: "The api port.",
                format: "port",
                default: 4000
            },
            host: {
                doc: "The api host.",
                format: "ipaddress",
                default: "127.0.0.1"
            },
            protocol: {
                doc: "The api protocol.",
                format: String,
                default: "http:"
            },
            path: {
                doc: "The api path.",
                format: String,
                default: "/"
            }
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
        }
    });

    // Load environment dependent configuration
    var env = config.get("env");
    config.loadFile(path.resolve(configDirectory, env + ".json"));

    // Perform validation
    config.validate();

    // Set easier to use database connection string
    var dbConnection = "mongodb://" +
        config.get("database.host") +
        ":" + config.get("database.port") +
        "/" + config.get("database.name");

    config.set("database.uri", dbConnection);

    // Set easier to use api connection string
    var apiConnection = config.get("api.protocol") + "//" +
        config.get("api.host") + ":" +
        config.get("api.port") +
        config.get("api.path");

    config.set("api.uri", apiConnection);

    return config;
};


module.exports = Config;
