"use strict";

var ApiController = require("./ApiController"),
    Page = require("../model/PageModel");


// http://jsonapi.org/format/
module.exports = ApiController.restForModel(Page, 10);
