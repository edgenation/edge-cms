var $ = require("jquery");
var Backbone = require("backbone");
var Marionette = require("backbone.marionette");

Backbone.$ = $;

// Create the application
var App = new Marionette.Application();

App.module("CmsModule", require("./cms/CmsModule"));

App.start();

// All navigation that is relative should be passed through the navigate
// method, to be processed by the router. If the link has a `data-bypass`
// attribute, bypass the delegation completely.
$(document).on("click", "a[href]:not([data-bypass])", function(evt) {
    // Get the anchor href and protocol
    var href = $(this).attr("href");
    var protocol = this.protocol + "//";

    // Ensure the protocol is not part of URL, meaning its relative.
    // Stop the event bubbling to ensure the link will not cause a page refresh.
    if (href.slice(protocol.length) !== protocol && href.substring(0, 1) !== "#") {
        evt.preventDefault();
        Backbone.history.navigate(href, true);
    }
});
