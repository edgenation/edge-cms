var mongoose = require("mongoose"),
    apiSchemaPlugin = require("./apiSchemaPlugin");

var PageListSchema = new mongoose.Schema({
    url: {
        type: String,
        index: { unique: true },
        trim: true,
        required: true,
        match: /^\/([a-z0-9\-\/]{0,1000})$/
    },

    pages: [{ type: mongoose.Schema.Types.ObjectId, ref: "page" }]
});

PageListSchema.plugin(apiSchemaPlugin, { type: "page-list"});

module.exports = mongoose.model("pageList", PageListSchema);
