var cmsHomeModule = angular.module("cmsHomeModule", []);

cmsHomeModule.config([
    "$stateProvider",
    function ($stateProvider) {
        $stateProvider.state("home", {
            url: "/",
            templateUrl: "partials/home.tpl.html"
        });
    }
]);

export default cmsHomeModule;
