var cmsError404 = angular.module("cms.error.404", [
    "ui.router"
]);

cmsError404.config([
    "$stateProvider",
    function ($stateProvider) {
        $stateProvider.state("errors.404", {
            url: "/404",
            template: "<h1>404</h1>"
        });
    }
]);

export default cmsError404;
