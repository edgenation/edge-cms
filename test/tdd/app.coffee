MOCK_PORT = 1234
expressApp =
    get: sinon.stub().returns MOCK_PORT
    set: sinon.spy()
    use: sinon.spy()
    listen: sinon.spy()

express = sinon.stub().returns expressApp
express.static = sinon.stub().returns "static"

bodyParser =
    urlencoded: sinon.stub().returns "urlencoded"
    json: sinon.stub().returns "json"

helmet =
    xframe: sinon.stub().returns "xframe"
    xssFilter: sinon.stub().returns "xssFilter"
    nosniff: sinon.stub().returns "nosniff"
    hidePoweredBy: sinon.stub().returns "hidePoweredBy"
    crossdomain: sinon.stub().returns "crossdomain"

App = proxyquire "../src/core/app",
    express: express
    compression: sinon.stub().returns "compression"
    "method-override": sinon.stub().returns "method-override"
    "response-time": sinon.stub().returns "response-time"
    "cookie-parser": sinon.stub().returnsArg 0
    "body-parser": bodyParser
    "helmet": helmet


describe "CMS.App", ->
    mockConfig = null
    
    beforeEach ->
        mockConfig = {
            port: MOCK_PORT
            get: sinon.stub().returnsArg 0
        }
        
        expressApp.set.reset()
        expressApp.use.reset()


    describe "create", ->
        app = null
        beforeEach ->
            app = App.create mockConfig
            
        it "creates an express app", ->
            app.should.equal expressApp
        it "sets the port", ->
            app.set.should.be.calledWith "port", "port"
        it "sets the view engine", ->
            app.set.should.be.calledWith "view engine", "jade"
        it "sets the views directory", ->
            app.set.should.be.calledWith "views", "views"
        it "uses gzip compression", ->
            app.use.should.be.calledWith "compression"
        it "uses the body parser to parse urlencoded forms", ->
            bodyParser.urlencoded.should.have.been.called
            app.use.should.be.calledWith "urlencoded"
        it "uses the body parser to parse json", ->
            bodyParser.json.should.have.been.called
            app.use.should.be.calledWith "json"
        it "uses helmet to set X-Frame-Options", ->
            helmet.xframe.should.have.been.called
            app.use.should.be.calledWith "xframe"
        it "uses helmet to set X-XSS-Protection for IE8+ and Chrome", ->
            helmet.xssFilter.should.have.been.called
            app.use.should.be.calledWith "xssFilter"
        it "uses helmet to set X-Content-Type-Options", ->
            helmet.nosniff.should.have.been.called
            app.use.should.be.calledWith "nosniff"
        it "uses helmet to remove X-Powered-By", ->
            helmet.hidePoweredBy.should.have.been.called
            app.use.should.be.calledWith "hidePoweredBy"
        it "uses helmet to generate crossdomain.xml", ->
            helmet.crossdomain.should.have.been.called
            app.use.should.be.calledWith "crossdomain"
        it "uses HTTP verbs", ->
            app.use.should.be.calledWith "method-override"
        it "uses response time headers", ->
            app.use.should.be.calledWith "response-time"
        it "uses a cookie parser", ->
            app.use.should.be.calledWith "cookie-secret-key"
        it "uses the app static public route", ->
            express.static.should.have.been.calledWith "public"
            app.use.should.be.calledWith "static"


    describe "start", ->
        it "listens on the port required", ->
            App.start expressApp
            expressApp.listen.should.have.been.calledWith MOCK_PORT
