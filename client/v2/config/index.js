var cmsConfigModule = angular.module("cmsConfigModule", [
    "ui.router"
]);

cmsConfigModule.config([
    "$locationProvider",
    "$urlRouterProvider",
    function ($locationProvider, $urlRouterProvider) {
        //$locationProvider.html5Mode(true);

        // Tidy the URL
        $urlRouterProvider.rule(function ($injector, $location) {
            var path = $location.path();

            // Remove trailing slashes from path
            if (path !== "/" && path.slice(-1) === "/") {
                $location.replace().path(path.slice(0, -1));
            }
        });
    }
]);


export default cmsConfigModule;
