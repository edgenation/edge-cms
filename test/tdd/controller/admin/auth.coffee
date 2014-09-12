
authController = require "../../../../src/controller/admin/auth"


describe "Auth Controller", ->
    request = null
    response = null

    beforeEach ->
        request = {}
        response =
            render: sinon.spy()

    describe "view", ->
        it "shows the login form", ->
            authController.view request, response
            response.render.should.have.been.calledWith "admin/login"