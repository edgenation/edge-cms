express = { listen: sinon.spy() }
mockery.registerMock "express", sinon.stub().returns express

mockery.enable
    warnOnReplace: false,
    warnOnUnregistered: false

CMS = require "../../src/core/cms"

mockery.deregisterMock "express"

describe "CMS", ->
    cms = null
    beforeEach -> cms = new CMS
    afterEach -> cms = null

    describe "constructor", ->
        it "is a function", -> (typeof CMS).should.equal "function"
        it "is instantiable", -> cms.should.be.ok


    describe "init", ->
        beforeEach -> sinon.stub cms, "createApp"
        afterEach -> cms.createApp.restore()

        it "uses the express app given", ->
            app = {id: 1}
            cms.init app
            cms.app.should.equal app
        it "creates a default express app", ->
            cms.init()
            cms.createApp.should.have.been.called


    describe "createApp", ->
        it "creates an express app", ->
            cms.createApp()
            cms.app.should.equal express


    describe "start", ->
        it "listens on port 3000", ->
            cms.init express
            cms.start()
            express.listen.should.have.been.called