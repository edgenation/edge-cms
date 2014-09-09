moment = format: sinon.stub().returns "current-date-time"
chalk =
    gray: sinon.stub().returns "[gray date]"
    dim: sinon.stub().returnsArg 0
    green: sinon.stub().returnsArg 0
    blue: sinon.stub().returnsArg 0
    yellow: sinon.stub().returnsArg 0
    red: sinon.stub().returnsArg 0
symbols =
    success: "tick"
    info: "i"
    warning: "?"
    error: "x"
    
Log = proxyquire "../src/core/log",
    moment: sinon.stub().returns moment
    chalk: chalk
    "log-symbols": symbols


describe "Log", ->
    beforeEach -> sinon.spy console, "log"
    afterEach -> console.log.restore()

    describe "log", ->
        beforeEach -> Log.log "test"

        it "formats the date with moment", ->
            moment.format.should.have.been.calledWith "YYYY-MM-DD HH:mm:ss.SSS"
        it "colours the date grey", ->
            chalk.gray.should.have.been.calledWith "[current-date-time]"
        it "logs the date and message", ->
            console.log.should.have.been.calledWith "[gray date] test"

    describe "log types", ->
        message = null
        beforeEach -> sinon.stub Log, "log"
        afterEach -> Log.log.restore()
        
        describe "debug", ->
            beforeEach ->
                message = "debug message"
                Log.debug message
            it "makes the message gray", ->
                chalk.dim.should.have.been.calledWith message
            it "logs the message", ->
                Log.log.should.have.been.calledWith message
            
        describe "success", ->
            beforeEach ->
                message = "success message"
                Log.success message
            it "makes the message green", ->
                chalk.green.should.have.been.calledWith message
            it "logs the message with a tick", ->
                Log.log.should.have.been.calledWith "tick " + message
            
        describe "info", ->
            beforeEach ->
                message = "info message"
                Log.info message
            it "makes the message blue", ->
                chalk.blue.should.have.been.calledWith message
            it "logs the message with an i", ->
                Log.log.should.have.been.calledWith "i " + message
            
        describe "warn", ->
            beforeEach ->
                message = "warn message"
                Log.warn message
            it "makes the message yellow", ->
                chalk.yellow.should.have.been.calledWith message
            it "logs the message with an ?", ->
                Log.log.should.have.been.calledWith "? " + message
            
        describe "error", ->
            beforeEach ->
                message = "error message"
                Log.error message
            it "makes the message red", ->
                chalk.red.should.have.been.calledWith message
            it "logs the message with an x", ->
                Log.log.should.have.been.calledWith "x " + message



###

    debug: (message) -> Log.log chalk.dim(message)
    success: (message) -> Log.log symbols.success + " " + chalk.green(message)
###