var ApiController = require("./index"),
    User = require("../../model/user");


// TODO: Authentication?
var UserController = ApiController.restForModel(User, 2);

module.exports = UserController;
