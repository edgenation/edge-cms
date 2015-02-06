var cmsError404Route = angular.module("cms.error.404.route.module", [
    "ui.router"
]);

cmsError404Route.config([
    "$stateProvider",
    function ($stateProvider) {
        $stateProvider.state("cms-error.404", {
            url: "/404",
            template: "<h1>404</h1>"
        });
    }
]);

export default cmsError404Route;
