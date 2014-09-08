CMS = require "../../src/CMS"


describe "CMS", ->
    describe "constructor", ->
        it "should be a function", -> (typeof CMS).should.equal "function"
        it "should be instantiable", -> (new CMS).should.be.ok
        it "should use the express app given", ->
            app = {id: 1}
            cms = new CMS(app)
            cms.app.should.equal app
        it "should create a default express app", ->
            sinon.spy(CMS.prototype, "createApp")
            cms = new CMS()
            CMS.prototype.createApp.should.have.been.called