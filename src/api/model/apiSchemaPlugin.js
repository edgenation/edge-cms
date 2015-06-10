function apiSchemaPlugin(schema, options) {
    // Add timestamps
    schema.add({
        created: {
            type: Date,
            default: Date.now,
            required: true
        },
        updated: {
            type: Date,
            default: Date.now,
            required: true
        }
    });

    // Update the timestamp on save
    schema.pre("save", function(next) {
        this.updated = Date.now();
        next();
    });

    // Remove and tidy data for json display
    schema.set("toJSON", {
        transform: function(doc, ret, opts) {
            var json = {
                id: ret._id,
                type: options.type,
                attributes: ret
            };
            delete json.attributes._id;
            delete json.attributes.__v;
            delete json.attributes.password;
            return json;
        }
    });
}

module.exports = apiSchemaPlugin;
