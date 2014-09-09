chalk = require "chalk"
moment = require "moment"
logSymbols = require "log-symbols"


Log =
    log: (message) ->
        date = moment().format("YYYY-MM-DD HH:mm:ss.SSS")
        console.log chalk.gray("[" + date + "]") + " " + message

    debug: (message) -> Log.log chalk.dim(message)
    success: (message) -> Log.log logSymbols.success + " " + chalk.green(message)
    info: (message) -> Log.log logSymbols.info + " " + chalk.blue(message)
    warn: (message) -> Log.log logSymbols.warning + " " + chalk.yellow(message)
    error: (message) -> Log.log logSymbols.error + " " + chalk.red(message)


module.exports = Log