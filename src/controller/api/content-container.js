var ApiController = require("./index"),
    ContentContainer = require("../../model/content-container");


var ContentContainerController = ApiController.restForModel(ContentContainer, 2);

module.exports = ContentContainerController;
