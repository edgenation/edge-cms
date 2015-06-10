var ApiController = require("./ApiController"),
    Content = require("../model/ContentModel");


var ContentController = ApiController.restForModel(Content, 2);

module.exports = ContentController;
