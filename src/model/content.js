var mongoose = require("mongoose");

var ContentSchema = new mongoose.Schema({
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


ContentSchema.pre("save", function (next) {
    // Update the timestamp
    this.updated = Date.now();
    next();
});


ContentSchema.set("toJSON", {
    transform: function (doc, ret, options) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
    }
});


module.exports = mongoose.model("Content", ContentSchema);
