import cmsPageList from "./list/page-list.route";

var cmsPage = angular.module("cms.page.route.module", [
    "ui.router",
    cmsPageList.name
]);

cmsPage.config([
    "$stateProvider",
    function ($stateProvider) {
        $stateProvider.state("cms-page", {
            abstract: true,
            template: "<ui-view></ui-view>"
        });
    }
]);

export default cmsPage;
