"use strict";

const ApiController = require("./ApiController"),
    User = require("../model/UserModel");

// TODO: Authentication?
const UserController = ApiController.restForModel(User, 2);

module.exports = UserController;
