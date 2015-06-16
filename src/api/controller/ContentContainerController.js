var ApiController = require("./ApiController"),
    ContentContainer = require("../model/RegionModel");


var ContentContainerController = ApiController.restForModel(ContentContainer, 2);

module.exports = ContentContainerController;
