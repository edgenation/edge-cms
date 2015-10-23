var ApiController = require("./ApiController"),
    Region = require("../model/RegionModel");


var RegionController = ApiController.restForModel(Region, 2);

module.exports = RegionController;
