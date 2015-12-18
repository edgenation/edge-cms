"use strict";

var sinon = require("sinon");
var chai = require("chai");
var sinonChai = require("sinon-chai");
var chaiAsPromised = require("chai-as-promised");
var proxyquire = require("proxyquire");

proxyquire.noCallThru();
chai.should();
chai.use(sinonChai);
chai.use(chaiAsPromised);

var Assertion = chai.Assertion;

chai.use(function(_chai, utils) {
    // Add return alias of equal and also be a chain
    utils.addChainableMethod(Assertion.prototype, "return", function(str) {
        let obj = utils.flag(this, "object");
        new Assertion(obj).to.be.equal(str);
    });
});

global.sinon = sinon;
global.proxyquire = proxyquire;
