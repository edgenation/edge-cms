var _ = require("lodash");
var angular = require("angular");

angular.element(document).ready(function() {
    angular.bootstrap(document, ["cmsAdmin"]);
});

var app = angular.module("cmsAdmin", [
    require("angular-ui-router"),
    require("angular-resource")
]);

app.config(["$urlRouterProvider", "$locationProvider", function($urlRouterProvider, $locationProvider) {
    $locationProvider.html5Mode(true);

    $urlRouterProvider.otherwise("/");
}]);

// Load all the modules
require("../modules/**/*Module.js", { mode: "expand" });
