express = { listen: sinon.spy() }
mockery.registerMock "express", sinon.stub().returns express

mockery.enable
    warnOnReplace: false,
    warnOnUnregistered: false

CMS = require "../../src/core/CMS"

mockery.deregisterMock "express"

describe "CMS", ->
    describe "constructor", ->
        beforeEach -> sinon.stub CMS.prototype, "createApp"
        afterEach -> CMS.prototype.createApp.restore()
        
        it "is a function", -> (typeof CMS).should.equal "function"
        it "is instantiable", -> (new CMS).should.be.ok
        it "uses the express app given", ->
            app = {id: 1}
            cms = new CMS(app)
            cms.app.should.equal app
        it "creates a default express app", ->
            cms = new CMS()
            CMS.prototype.createApp.should.have.been.called


    describe "createApp", ->
        it "creates an express app", ->
            cms = new CMS({})
            cms.createApp()
            cms.app.should.equal express


    describe "start", ->
        it "listens on port 3000", ->
            cms = new CMS express
            cms.start()
            express.listen.should.have.been.called