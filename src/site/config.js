"use strict";

const path = require("path");
const convict = require("convict");


/**
 * @param {string} configDirectory
 * @returns {Object}
 */
var config = function (configDirectory) {
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
                default: "EdgeCMS"
            },
            "cookie-secret-key": {
                doc: "A secret key for cookies.",
                default: "edge-cms-secret-key"
            }
        },
        api: {
            uri: {
                doc: "The full app URI",
                default: ""
            },
            port: {
                doc: "The api port.",
                default: 0
            },
            host: {
                doc: "The api host.",
                default: ""
            },
            protocol: {
                doc: "The api protocol.",
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
                doc: "The mongodb URI",
                format: String,
                default: "",
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
        let host = config.get("app.host");
        if (host === "0.0.0.0") {
            host = "127.0.0.1";
        }
        config.set("api.host", host);
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


module.exports = config;
