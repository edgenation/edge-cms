var ApiController = require("./ApiController"),
    ContentContainer = require("../model/ContentContainerModel");


var ContentContainerController = ApiController.restForModel(ContentContainer, 2);

module.exports = ContentContainerController;
