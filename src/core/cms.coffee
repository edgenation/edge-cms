express = require "express"

Log = require "./log"

class CMS
    init: (@app) ->
        if not @app then @createApp()

    createApp: ->
        @app = express()

    start: ->
        server = @app.listen 3000, ->
            Log.success "Listening on port " + server.address().port

    use: (middleware) -> middleware @

    configure: ->


module.exports = CMS