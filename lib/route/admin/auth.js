(function() {
  var auth, router;

  router = require("express").Router();

  auth = require("../../controller/admin/auth");

  router.get("/login", auth.view);

  router.post("/login", auth.login);

  router.get("/logout", auth.login);

  module.exports = router;

}).call(this);
