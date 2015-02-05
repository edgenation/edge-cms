var ApiController = require("./index"),
    Content = require("../../model/content");


var ContentController = ApiController.restForModel(Content, 2);

module.exports = ContentController;
