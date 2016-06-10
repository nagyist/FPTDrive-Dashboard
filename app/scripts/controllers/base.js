'use strict';

/**
 * @ngdoc function
 * @name fptdriveApp.controller:BaseCtrl
 * @description
 * # BaseCtrl
 * Controller of the fptdriveApp
 */
angular.module('fptdriveApp')
    .controller('BaseCtrl', function($rootScope, $scope, AuthenticationService, $location) {
        this.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
        ];

        $scope.logout = function() {
            AuthenticationService.RemoveCredential();
            $rootScope.globals ={};
            $location.path("/login");
        };
    $scope.numberMessage =2;
    $scope.numberNotification = 4;

    });
