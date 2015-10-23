var angular = require("angular");

var app = angular.module("cmsAdmin");

app.config(['$stateProvider', function($stateProvider) {
    $stateProvider
        .state('index', {
            url: '/',
            template: require("./index.jade")
        });
}]);
