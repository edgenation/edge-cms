"use strict";

var ApiController = require("./ApiController"),
    Region = require("../model/RegionModel");

module.exports = ApiController.restForModel(Region, 2);
