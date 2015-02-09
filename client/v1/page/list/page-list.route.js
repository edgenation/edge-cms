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


class CmsPageListCtrl {
    constructor(Page) {
        console.log("CmsPageListCtrl");
        this.pages = [];

        Page.all().then(response => this.pages = response.pages);
    }
}
CmsPageListCtrl.$inject = ["cms.page.factory"];

cmsPageList.controller("cmsPageListCtrl", CmsPageListCtrl);


export default cmsPageList;
