var mongoose = require("mongoose");

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
        index: {unique: true},
        trim: true,
        required: true,
        match: /^([a-z0-9\-\/]{1,1000})$/
    },
    created: {
        type: Date,
        default: Date.now,
        required: true
    },
    updated: {
        type: Date,
        default: Date.now,
        required: true
    },

    containers: [{type: mongoose.Schema.Types.ObjectId, ref: "ContentContainer"}]
});


PageSchema.pre("save", function (next) {
    // Update the timestamp
    this.updated = Date.now();
    next();
});


PageSchema.set("toJSON", {
    transform: function(doc, ret, options) {
        var json = {
            id: ret._id,
            type: "page",
            attributes: ret
        };
        delete json.attributes._id;
        delete json.attributes.__v;
        return json;
    }
});


module.exports = mongoose.model("Page", PageSchema);
