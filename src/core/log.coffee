chalk = require "chalk"
moment = require "moment"


Log =
    log: (message) ->
        date = moment().format("YYYY-MM-DD HH:mm:ss.SSS")
        console.log chalk.gray("[" + date + "]") + " " + message

    debug: (message) -> Log.log chalk.dim message
    success: (message) -> Log.log chalk.green message
    info: (message) -> Log.log chalk.blue message
    warn: (message) -> Log.log chalk.yellow message
    error: (message) -> Log.log chalk.red message


module.exports = Log