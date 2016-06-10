'use strict';

/**
 * @ngdoc function
 * @name fptdriveApp.controller:RouteinfomationCtrl
 * @description
 * # RouteinfomationCtrl
 * Controller of the fptdriveApp
 */
angular.module('fptdriveApp')
  .controller('RouteInformationCtrl', function ($scope) {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
    $scope.sltId =-1;
    $scope.ids = [1,2,3,4,5,6,7,8,9];
    var data = [
    	{_id: "1", _time: "5h 00 - 21h 00", _depart: "Bus station Gia Lam", _return: "Bus station Yen Nghia", _min: "10"},
    	{_id: "2", _time: "5h 00 - 21h 00", _depart: "Bus station Gia Lam", _return: "Bus station Yen Nghia", _min: "10"},
    	{_id: "3", _time: "5h 00 - 21h 00", _depart: "Bus station Gia Lam", _return: "Bus station Yen Nghia", _min: "10"},
    	{_id: "4", _time: "5h 00 - 21h 00", _depart: "Bus station Gia Lam", _return: "Bus station Yen Nghia", _min: "10"},
    	{_id: "5", _time: "5h 00 - 21h 00", _depart: "Bus station Gia Lam", _return: "Bus station Yen Nghia", _min: "10"},
    	{_id: "6", _time: "5h 00 - 21h 00", _depart: "Bus station Gia Lam", _return: "Bus station Yen Nghia", _min: "10"},
    	{_id: "7", _time: "5h 00 - 21h 00", _depart: "Bus station Gia Lam", _return: "Bus station Yen Nghia", _min: "10"},
    	{_id: "8", _time: "5h 00 - 21h 00", _depart: "Bus station Gia Lam", _return: "Bus station Yen Nghia", _min: "10"},
    	{_id: "9", _time: "5h 00 - 21h 00", _depart: "Bus station Gia Lam", _return: "Bus station Yen Nghia", _min: "10"},
    	{_id: "1", _time: "5h 00 - 21h 00", _depart: "Bus station Gia Lam", _return: "Bus station Yen Nghia", _min: "10"},
    	{_id: "2", _time: "5h 00 - 21h 00", _depart: "Bus station Gia Lam", _return: "Bus station Yen Nghia", _min: "10"},
    	{_id: "3", _time: "5h 00 - 21h 00", _depart: "Bus station Gia Lam", _return: "Bus station Yen Nghia", _min: "10"},
    	{_id: "4", _time: "5h 00 - 21h 00", _depart: "Bus station Gia Lam", _return: "Bus station Yen Nghia", _min: "10"},
    	{_id: "5", _time: "5h 00 - 21h 00", _depart: "Bus station Gia Lam", _return: "Bus station Yen Nghia", _min: "10"},
    	{_id: "6", _time: "5h 00 - 21h 00", _depart: "Bus station Gia Lam", _return: "Bus station Yen Nghia", _min: "10"},
    	{_id: "7", _time: "5h 00 - 21h 00", _depart: "Bus station Gia Lam", _return: "Bus station Yen Nghia", _min: "10"},
    	{_id: "8", _time: "5h 00 - 21h 00", _depart: "Bus station Gia Lam", _return: "Bus station Yen Nghia", _min: "10"},
    	{_id: "9", _time: "5h 00 - 21h 00", _depart: "Bus station Gia Lam", _return: "Bus station Yen Nghia", _min: "10"},
    	{_id: "1", _time: "5h 00 - 21h 00", _depart: "Bus station Gia Lam", _return: "Bus station Yen Nghia", _min: "10"},
    	{_id: "2", _time: "5h 00 - 21h 00", _depart: "Bus station Gia Lam", _return: "Bus station Yen Nghia", _min: "10"},
    	{_id: "3", _time: "5h 00 - 21h 00", _depart: "Bus station Gia Lam", _return: "Bus station Yen Nghia", _min: "10"},
    	{_id: "4", _time: "5h 00 - 21h 00", _depart: "Bus station Gia Lam", _return: "Bus station Yen Nghia", _min: "10"},
    	{_id: "5", _time: "5h 00 - 21h 00", _depart: "Bus station Gia Lam", _return: "Bus station Yen Nghia", _min: "10"},
    	{_id: "6", _time: "5h 00 - 21h 00", _depart: "Bus station Gia Lam", _return: "Bus station Yen Nghia", _min: "10"},
    	{_id: "7", _time: "5h 00 - 21h 00", _depart: "Bus station Gia Lam", _return: "Bus station Yen Nghia", _min: "10"},
    	{_id: "8", _time: "5h 00 - 21h 00", _depart: "Bus station Gia Lam", _return: "Bus station Yen Nghia", _min: "10"},
    	{_id: "9", _time: "5h 00 - 21h 00", _depart: "Bus station Gia Lam", _return: "Bus station Yen Nghia", _min: "10"},
    ]
    $scope.routes = data;

    $scope.isSelected = function(item){
    	console.log($scope.sltId);
    	if($scope.sltId===-1) return true;
    	return item._id === $scope.sltId;
    }
  });
