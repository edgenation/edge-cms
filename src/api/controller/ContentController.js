"use strict";

var ApiController = require("./ApiController"),
    Content = require("../model/ContentModel");

module.exports = ApiController.restForModel(Content, 10);
