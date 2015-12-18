"use strict";

var mongoose = require("mongoose"),
    apiSchemaPlugin = require("./apiSchemaPlugin");

var ContentSchema = new mongoose.Schema({
    type: {
        type: String,
        trim: true,
        required: true,
        match: /^([a-z0-9\-\/ ]{3,100})$/
    },
    data: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    }
});

ContentSchema.plugin(apiSchemaPlugin, { type: "content" });

module.exports = mongoose.model("content", ContentSchema);
