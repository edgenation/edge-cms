import cmsPageFactory from "../page.srv";

var cmsPageList = angular.module("cms.page.list.route.module", [
    "ui.router",
    cmsPageFactory.name
]);

cmsPageList.config([
    "$stateProvider",
    function ($stateProvider) {
        $stateProvider.state("cms-page.list", {
            url: "/page",
            template: "<h1>List</h1>",
            controller: "cmsPageListCtrl"
        });
    }
]);

cmsPageList.controller("cmsPageListCtrl", [
    "Page",
    function (Page) {
        Page.all().success(function (data) {
            console.log(data);
        });
    }
]);


export default cmsPageList;
