'use strict';

/**
 * @ngdoc function
 * @name fptdriveApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the fptdriveApp
 */
angular.module('fptdriveApp')
    .controller('LoginCtrl', function($rootScope, $scope, $cookies, $location, AuthenticationService) {
        this.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
        ];

        $scope.authenticate = function() {
            AuthenticationService.CreateCredential($scope.username, $scope.password, function(response) {
                if (response.success) {
                    AuthenticationService.SetCredential(response.data);
                    $rootScope.globals = angular.fromJson(response.data,true);
                    $location.path("/");
                } else {
                    $scope.error = response.data;
                    console.log($scope.error);
                }
            });
        };

    });