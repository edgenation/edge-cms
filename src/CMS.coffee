express = require "express"

class CMS
    constructor: (@app) ->
        if not @app then @createApp()

    createApp: ->
        @app = express()

    start: ->
        server = @app.listen 3000, ->
            console.log("Listening on port %d", server.address().port);

module.exports = CMS