var ApiController = require("./ApiController"),
    User = require("../model/User");


// TODO: Authentication?
var UserController = ApiController.restForModel(User, 2);

module.exports = UserController;
