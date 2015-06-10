var mongoose = require("mongoose"),
    apiSchemaPlugin = require("./apiSchemaPlugin");

var ContentContainerSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true,
        match: /^([a-z0-9\-\/ ]{3,1000})$/
    },

    // TODO: Specify restrictions on what can go in content?
    content: [{type: mongoose.Schema.Types.ObjectId, ref: "content"}]
});

ContentContainerSchema.plugin(apiSchemaPlugin, { type: "content-container" });

module.exports = mongoose.model("content-container", ContentContainerSchema);
