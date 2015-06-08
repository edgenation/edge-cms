var ApiController = require("./ApiController"),
    ContentContainer = require("../model/ContentContainer");


var ContentContainerController = ApiController.restForModel(ContentContainer, 2);

module.exports = ContentContainerController;
