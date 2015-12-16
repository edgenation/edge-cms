// Custom nunjucks tag to load content mixins
// Usage in views: {% cmsContent contentObj %}

function CmsContent() {
    this.tags = ["cmsContent"];
    this.parse = function (parser, nodes, lexer) {
        var token = parser.nextToken();
        var args = parser.parseSignature(null, true);
        parser.advanceAfterBlockEnd(token.value);
        return new nodes.CallExtensionAsync(this, 'run', args);
    };
    this.run = function (context, theContent, callback) {
        var mixinName = "content" + theContent.type[0].toUpperCase() + theContent.type.slice(1);
        var mixinFile = "mixins/content/_" + theContent.type + ".nunj";

        context.env
            .getTemplate(mixinFile)
            .getExported(function (ctx, obj) {
                callback(null, obj[mixinName](theContent));
            });
    };
}

module.exports = CmsContent;
