class CMS
    constructor: (@app) ->
        if not @app then @createApp()

    createApp: ->
        # TODO: Create an express app?


module.exports = CMS