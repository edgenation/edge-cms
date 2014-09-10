expressApp =
    get: sinon.spy()
    set: sinon.spy()
    use: sinon.spy()

express = sinon.stub().returns expressApp
express.static = sinon.stub().returns "static"

multiViews = sinon.spy()

CMS = proxyquire "../src/core/cms",
    "./multi-views": multiViews
    express: express


describe "CMS", ->
    cms = null
    mockConfig = get: sinon.stub().returnsArg 0
    beforeEach -> cms = new CMS()
    afterEach -> cms = null

    describe "constructor", ->
        it "is a function", -> (typeof CMS).should.equal "function"
        it "is instantiable", -> cms.should.be.ok

    describe "setConfig", ->
        it "sets the config", ->
            cms.setConfig mockConfig
            cms.config.should.equal mockConfig

    # TODO: ./multi-views does not seem to be getting mocked by proxyquire
    # Seems this is to with blanket? :(
    # Might have to investigate moving to istanbul / ibrik
    xdescribe "setApp", ->
        beforeEach -> cms.setConfig mockConfig
        it "enables multiple view locations on the app", ->
            cms.setApp expressApp
            multiViews.should.have.been.calledWith expressApp
        xit "sets the views to use both the app and cms directorires", ->
        xit "uses the admin static public route", ->

        
    describe "use", ->
        mockMiddleware = null

        beforeEach ->
            mockMiddleware = sinon.stub().returns 12
        it "calls the middleware function", ->
            cms.use mockMiddleware
            mockMiddleware.should.have.been.calledWith cms
        it "returns the middleware result", ->
            cms.use(mockMiddleware).should.equal 12
