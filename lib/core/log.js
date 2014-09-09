(function() {
  var Log, chalk, moment, symbols;

  chalk = require("chalk");

  moment = require("moment");

  symbols = require("log-symbols");

  Log = {
    log: function(message) {
      var date;
      date = moment().format("YYYY-MM-DD HH:mm:ss.SSS");
      return console.log(chalk.gray("[" + date + "]") + " " + message);
    },
    debug: function(message) {
      return Log.log(chalk.dim(message));
    },
    success: function(message) {
      return Log.log(symbols.success + " " + chalk.green(message));
    },
    info: function(message) {
      return Log.log(symbols.info + " " + chalk.blue(message));
    },
    warn: function(message) {
      return Log.log(symbols.warning + " " + chalk.yellow(message));
    },
    error: function(message) {
      return Log.log(symbols.error + " " + chalk.red(message));
    }
  };

  module.exports = Log;

}).call(this);
