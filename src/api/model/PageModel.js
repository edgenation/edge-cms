var mongoose = require("mongoose"),
    apiSchemaPlugin = require("./apiSchemaPlugin");

var PageSchema = new mongoose.Schema({
    title: {
        required: true,
        type: String,
        trim: true,
        // match: /^([[:alpha:][:space:][:punct:]]{1,100})$/
        match: /^([^\f\n\r\t]{1,100})$/
    },
    url: {
        type: String,
        index: { unique: true },
        trim: true,
        required: true,
        match: /^\/([a-z0-9\-\/]{0,1000})$/
    },

    template: {
        required: true,
        type: String,
        trim: true,
        default: "default",
        match: /^([^\f\n\r\t]{1,100})$/
    },

    regions: [{ type: mongoose.Schema.Types.ObjectId, ref: "region" }]
});

PageSchema.plugin(apiSchemaPlugin, { type: "page"});

module.exports = mongoose.model("page", PageSchema);
