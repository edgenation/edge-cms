var cmsErrorModule = angular.module("cmsErrorModule", []);

cmsErrorModule.config([
    "$stateProvider",
    "$urlRouterProvider",
    function ($stateProvider, $urlRouterProvider) {
        $stateProvider.state("error", {
            templateUrl: "partials/404.tpl.html"
        });

        $urlRouterProvider.otherwise(function ($injector) {
            $injector.invoke([
                "$state",
                function ($state) {
                    $state.go("error");
                }
            ]);
            return true;
        });
    }
]);

export default cmsErrorModule;
