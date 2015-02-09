// http://www.sitepoint.com/writing-angularjs-apps-using-es6/
// https://github.com/sravikiran/Angular-ES6-BookShelf


import CmsPageService from "./page.svc";
import CmsPageController from "./page.ctrl";


var cmsPageModule = angular.module("cmsPageModule", []);

cmsPageModule.config([
    "$stateProvider",
    function ($stateProvider) {
        $stateProvider.state("page", {
            url: "/page",
            templateUrl: "partials/page.tpl.html",
            controller: "cms.page.listController"
        });

        //$stateProvider.state("page.list", {
        //    url: "/list",
        //    //templateUrl: "partials/page.list.tpl.html",
        //    templateUrl: "partials/page.tpl.html",
        //    controller: "cms.page.listController"
        //});
        //
        //$stateProvider.state("page.details", {
        //    url: "/page/:pageId",
        //    templateUrl: "partials/page.details.tpl.html",
        //    controller: "cms.page.detailsController"
        //});
        //
        //$stateProvider.state("page.add", {
        //    url: "/add",
        //    templateUrl: "partials/page.add.tpl.html",
        //    controller: "cms.page.addController"
        //});
    }
]);

cmsPageModule.factory("CmsPageService", CmsPageService);
cmsPageModule.controller("cms.page.listController", CmsPageController);
//cmsPageModule.controller("CmsPageController", CmsPageController);

export default cmsPageModule;


