var ApiController = require("./ApiController"),
    Content = require("../model/Content");


var ContentController = ApiController.restForModel(Content, 2);

module.exports = ContentController;
