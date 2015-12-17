var ApiController = require("./ApiController"),
    PageList = require("../model/PageListModel");

var PageListController = ApiController.restForModel(PageList, 10);

module.exports = PageListController;
