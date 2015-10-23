var angular = require("angular");

var app = angular.module("cmsAdmin");

app.controller('PageDetailController', ["$scope", "$stateParams", "Page", function($scope, $stateParams, Page) {
    $scope.page = Page.get({ id: $stateParams.id });

    $scope.updatePage = function() {
        console.log('UPDATE!');
        Page.update($scope.page);
        //$location.path('/user-list');
    };
}]);


app.config(['$stateProvider', function($stateProvider) {
    $stateProvider
        .state('pageDetail', {
            url: '/page/:id',
            template: require("./detail.jade"),
            controller: "PageDetailController"
        });
}]);
