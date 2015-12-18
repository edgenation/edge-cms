/* global global, describe, it, beforeEach, afterEach, after */
"use strict";


require("../../../helpers");

// TODO: Mock ApiController?
// TODO: Mock ContentController

var ApiController = require("../../../../src/api/controller/ApiController");
var ContentController = require("../../../../src/api/controller/ContentController");

// Mocks
var sandbox = sinon.sandbox.create();
var MockApiController = sandbox.stub(ApiController);
var MockContentController = sandbox.stub(ContentController);

var route = proxyquire("../../src/api/route/content", {
    "../controller/ApiController": MockApiController,
    "../controller/ContentController": MockContentController
});


describe("api/route/content", function () {
    after(function () {
        sandbox.restore();
    });

    beforeEach(function () {
        sandbox.reset();
    });

    it("creates an express router");

    it("returns the express router");

    it("validates id parameters");

    it("GET / lists all of the content items", function() {
        route.handle({ method: "get", "url": "/" });
        MockContentController.list.should.have.been.called;
    });

    it("POST / creates a new content item", function() {
        route.handle({ method: "post", "url": "/" });
        MockContentController.create.should.have.been.called;
    });

    it("GET /:id gets a content items details", function() {
        MockApiController.validateId.callsArg(2);
        route.handle({ method: "get", "url": "/123" });
        MockContentController.details.should.have.been.called;
    });

});
