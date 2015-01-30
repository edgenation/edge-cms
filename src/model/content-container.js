var mongoose = require("mongoose");

var ContentContainerSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true,
        match: /^([a-z0-9\-\/ ]{3,1000})$/
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

    // TODO: Specify restrictions on what can go in content?
    content: [{type: mongoose.Schema.Types.ObjectId, ref: "Content"}]
});


ContentContainerSchema.pre("save", function (next) {
    // Update the timestamp
    this.updated = Date.now();
    next();
});


ContentContainerSchema.set("toJSON", {
    transform: function (doc, ret, options) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
    }
});

module.exports = mongoose.model("ContentContainer", ContentContainerSchema);
