chalk = require "chalk"
moment = require "moment"
symbols = require "log-symbols"


Log =
    log: (message) ->
        date = moment().format("YYYY-MM-DD HH:mm:ss.SSS")
        console.log chalk.gray("[" + date + "]") + " " + message

    debug: (message) -> Log.log chalk.dim(message)
    success: (message) -> Log.log symbols.success + " " + chalk.green(message)
    info: (message) -> Log.log symbols.info + " " + chalk.blue(message)
    warn: (message) -> Log.log symbols.warning + " " + chalk.yellow(message)
    error: (message) -> Log.log symbols.error + " " + chalk.red(message)


module.exports = Log