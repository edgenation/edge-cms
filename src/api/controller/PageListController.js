"use strict";

const ApiController = require("./ApiController"),
    PageList = require("../model/PageListModel");

module.exports = ApiController.restForModel(PageList, 10);
