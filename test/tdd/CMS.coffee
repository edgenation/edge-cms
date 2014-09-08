CMS = require "../../src/CMS"


describe "CMS", ->
    describe "constructor", ->
        it "should be a function", -> (typeof CMS).should.equal "function"
        it "should be instantiable", -> (new CMS).should.be.ok
