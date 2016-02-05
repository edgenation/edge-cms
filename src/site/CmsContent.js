"use strict";

// Custom nunjucks tag to load content mixins
// Usage in views: {% cmsContent contentObj %}
class CmsContent {
    constructor() {
        this.tags = ["cmsContent"];
    }

    parse(parser, nodes, lexer) {
        let token = parser.nextToken();
        let args = parser.parseSignature(null, true);
        parser.advanceAfterBlockEnd(token.value);
        return new nodes.CallExtensionAsync(this, "run", args);
    }

    run(context, theContent, callback) {
        if (!theContent || !theContent.type) {
            return callback(null, "");
        }

        let mixinName = "content" + theContent.type[0].toUpperCase() + theContent.type.slice(1);
        let mixinFile = `mixins/content/_${theContent.type}.nunj`;

        // Safely handle templates that do not exist
        try {
            context.env
                .getTemplate(mixinFile)
                .getExported(function (ctx, obj) {
                    callback(null, obj[mixinName](theContent));
                });
        } catch (e) {
            // TODO: Nice error log
            console.error(e);
            callback(e);
        }
    }
}

module.exports = CmsContent;
