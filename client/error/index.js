import cmsError404 from "./404";

var cmsError = angular.module("cms.error", [
    "ui.router",
    cmsError404.name
]);

cmsError.config([
    "$stateProvider",
    function ($stateProvider) {
        $stateProvider.state("errors", {
            abstract: true,
            template: "<ui-view></ui-view>"
        });
    }
]);

export default cmsError;
