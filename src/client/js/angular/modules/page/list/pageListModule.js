var angular = require("angular");
require("../PageService");

var app = angular.module("cmsAdmin");

app.controller('PagesController', ["$scope", "Page", function($scope, Page) {

    $scope.orderProp = "age";

    // Fetch all pages. Issues a GET to /api/pages
    $scope.pages = Page.query();
}]);

app.config(['$stateProvider', function($stateProvider) {
    $stateProvider
        .state('pages', {
            url: '/page',
            template: require("./list.jade"),
            controller: 'PagesController'
        });
}]);
