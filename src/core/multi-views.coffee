# Usage:
# express = require "express"
# require("./multi-views")(express)

multiViews = (viewName) ->
    context = null
    match = null
    if this.root instanceof Array
        for i in [0...@root.length]
            context = {root: @root[i]}
            match = lookup_proxy.call context, viewName
            if match then return match
        return null
    return lookup_proxy.call this, viewName


module.exports = (app) ->
    # Monkey-patch express to accept multiple paths for looking up views.
    # this path may change depending on your setup.
    lookup_proxy = app.get("view").prototype.lookup

    app.get("view").prototype.lookup = multiViews