"use strict";

var mongoose = require("mongoose"),
    apiSchemaPlugin = require("./apiSchemaPlugin");

var RegionSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true,
        match: /^([a-z0-9\-\/ ]{3,1000})$/
    },

    // TODO: Specify restrictions on what can go in content?
    content: [{type: mongoose.Schema.Types.ObjectId, ref: "content"}]
});

RegionSchema.plugin(apiSchemaPlugin, { type: "region" });

module.exports = mongoose.model("region", RegionSchema);
