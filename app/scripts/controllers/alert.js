'use strict';

/**
 * @ngdoc function
 * @name fptdriveApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the fptdriveApp
 */
angular.module('fptdriveApp')
    .controller('AlertCtrl', function($scope) {
        this.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
        ];

        $scope.alerts = [{
            _id: 1,
            _bus: "Bus 02",
            _route: 39,
            _desc: "Temperature is higher than normal",
            _level: "Low",
            _created_time: "15:30 12/12/2015",
            _created_by: "System"
        }, {
            _id: 2,
            _bus: "Bus 01",
            _route: 39,
            _desc: "Abnormal Fuel Consumption",
            _level: "Medium",
            _created_time: "15:30 12/12/2015",
            _created_by: "System"
        }, {
            _id: 3,
            _bus: "Bus 01",
            _route: 39,
            _desc: "Distance is too close",
            _level: "High",
            _created_time: "15:30 12/12/2015",
            _created_by: "System"
        }, {
            _id: 4,
            _bus: "Bus 04",
            _route: 39,
            _desc: "Temperature is higher than normal",
            _level: "Low",
            _created_time: "15:30 12/12/2015",
            _created_by: "System"
        }, {
            _id: 5,
            _bus: "Bus 04",
            _route: 39,
            _desc: "Abnormal Fuel Consumption",
            _level: "Medium",
            _created_time: "15:30 12/12/2015",
            _created_by: "System"
        }, {
            _id: 6,
            _bus: "Bus 03",
            _route: 39,
            _desc: "Driver is not concentrate",
            _level: "High",
            _created_time: "15:30 12/12/2015",
            _created_by: "System"
        }];

        $scope.getFirstLetter = function(s){
        	return s.charAt(0);
        }

        $scope.bindDataToModal = function(data){
            $scope.modal_data =data;
        }
    });
