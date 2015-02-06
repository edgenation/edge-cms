import cmsError404Route from "./404/error-404.route";

var cmsError = angular.module("cms.error.route.module", [
    "ui.router",
    cmsError404Route.name
]);

cmsError.config([
    "$stateProvider",
    function ($stateProvider) {
        $stateProvider.state("cms-error", {
            abstract: true,
            template: "<ui-view></ui-view>"
        });
    }
]);

export default cmsError;
