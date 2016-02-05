"use strict";

const ApiController = require("./ApiController"),
    Content = require("../model/ContentModel");

module.exports = ApiController.restForModel(Content, 10);
