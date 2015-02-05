import cmsError from "../error/index";

var cmsConfig = angular.module("cms.config", [
    "ui.router",
    cmsError.name
]);

cmsConfig.config([
    "$locationProvider",
    "$urlRouterProvider",
    function ($locationProvider, $urlRouterProvider) {
        $locationProvider.html5Mode(true);


        $urlRouterProvider.rule(function ($injector, $location) {
            var path = $location.path();

            // Remove trailing slashes from path
            if (path !== "/" && path.slice(-1) === "/") {
                $location.replace().path(path.slice(0, -1));
            }
        });

        $urlRouterProvider.otherwise("/404");
    }
]);

cmsConfig.run();

export default cmsConfig;
