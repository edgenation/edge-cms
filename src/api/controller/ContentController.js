var ApiController = require("./ApiController"),
    Content = require("../model/content");


var ContentController = ApiController.restForModel(Content, 2);

module.exports = ContentController;
