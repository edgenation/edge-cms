chai = require "chai"
sinon = require "sinon"
sinonChai = require "sinon-chai"
 
global.should = chai.should()
global.sinon = sinon
chai.use sinonChai

global.proxyquire = require("proxyquire").noCallThru()