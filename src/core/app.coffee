express = require "express"
compression = require "compression"
bodyParser = require "body-parser"
helmet = require "helmet"
methodOverride = require "method-override"
responseTime = require "response-time"
cookieParser = require "cookie-parser"

Log = require "./log"


module.exports =
    create: (config) ->
        app = express()
        
        app.set "port", config.get("port")
        app.set "view engine", "jade"
        app.set "views", config.get("views")
        
        app.use compression() # Enable gzip
        app.use bodyParser.urlencoded({extended: true})
        app.use bodyParser.json()
        app.use helmet.xframe()
        app.use helmet.xssFilter()
        app.use helmet.nosniff()
        app.use helmet.hidePoweredBy()
        app.use helmet.crossdomain()
        #app.use helmet.nocache()
        app.use methodOverride()
        app.use responseTime()
        app.use cookieParser config.get("cookie-secret-key")
        
        # Set public directory
        app.use express["static"] config.get("public")
        
        return app


    start: (app) ->
        server = app.listen app.get("port"), ->
            Log.success "Listening on port " + server.address().port