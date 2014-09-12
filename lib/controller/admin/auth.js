(function() {
  var auth;

  auth = {
    view: function(req, res, next) {
      return res.render("admin/login");
    },
    login: function(req, res, next) {},
    logout: function(req, res, next) {}
  };

  module.exports = auth;

}).call(this);
