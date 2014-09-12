express = require "express"

MultiViews = require "./multi-views"

class CMS
    setConfig: (@config) ->


    setApp: (@app) ->
        # Enable multiple view directories
        MultiViews @app
        @app.set "views", [
            @config.get("views")        # Client app views
            "#{__dirname}/../view"      # CMS core views
        ]

        # Admin assets
        @app.use express["static"] "/admin/assets", "#{__dirname}/../public"

    use: (middleware) -> middleware @


module.exports = CMS