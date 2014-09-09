express = require "express"

class CMS
    init: (@app) ->
        if not @app then @createApp()

    createApp: ->
        @app = express()

    start: ->
        server = @app.listen 3000, ->
            console.log("Listening on port %d", server.address().port);

    use: (middleware) -> middleware @

    configure: ->


module.exports = CMS