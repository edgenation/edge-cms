#express = {listen: sinon.spy()}
#mockery.registerMock "express", sinon.stub().returns express

mockery.enable
    warnOnReplace: false,
    warnOnUnregistered: false

Log = require "../../src/core/log"

#mockery.deregisterMock "express"

describe "Log", ->
    describe "log", ->
        xit "formats the date with moment", ->
        xit "logs the date and message", ->


###

    log: (message) ->
        date = moment().format("YYYY-MM-DD HH:mm:ss.SSS")
        console.log chalk.gray("[" + date + "]") + " " + message
###