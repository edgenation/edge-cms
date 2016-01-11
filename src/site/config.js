"use strict";

var path = require("path");
var convict = require("convict");


var Config = function (configDirectory) {
    // Define schema
    let config = convict({
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
                format: "port"
            },
            host: {
                doc: "The api host.",
                format: "ipaddress"
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
            uri: {
                doc: "The mongodb URI"
                format: String,
                default: ""
                env: "MONGOLAB_URI"
            },
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
    let env = config.get("env");
    config.loadFile(path.resolve(configDirectory, env + ".json"));

    // Perform validation
    config.validate();

    // Set easier to use database connection string
    if (!config.get("database.uri")) {
        config.set("database.uri",
            "mongodb://" + config.get("database.host") +
            ":" + config.get("database.port") +
            "/" + config.get("database.name")
        );
    }

    // Default to same api host
    if (!config.get("api.host")) {
        config.set("api.host", config.get("app.host"));
    }

    // Default to same api port
    if (!config.get("api.port")) {
        config.set("api.port", config.get("app.port"));
    }

    // Set easier to use api connection string
    if (!config.get("api.uri")) {
        config.set("api.uri",
            config.get("api.protocol") + "//" +
            config.get("api.host") + ":" +
            config.get("api.port") +
            config.get("api.path")
        );
    }

    return config;
};


module.exports = Config;
