'use strict';

/**
 * @ngdoc function
 * @name fptdriveApp.controller:AboutCtrl
 * @description
 * # ManageDeviceCtrl
 * Controller of the fptdriveApp
 */
angular.module('fptdriveApp')
  .controller('ManageDeviceCtrl', function ($scope, $http) {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    $scope.dateOptions = {
      formatYear: 'yy',
      maxDate: new Date(),
      minDate: new Date(2008, 10,27),
      startingDay: 1
    };

    $scope.formatDate = 'dd/MM/yyyy';

    $scope.assets = [];
    $scope.popupFromDate = {
      opened: false
    }

    $scope.popupToDate = {
      opened: false
    }

    $scope.currentPage = 1;
    $scope.itemPerPage = 5;
    var partOf = function (a, i) {
      i -= 1;
      return a.slice(i * $scope.itemPerPage, Math.min((i + 1) * $scope.itemPerPage, a.length));
    }

    $scope.assets_slice;

    $http.get("/api/assets").then(function (response) {
      console.log(response.data);
      $scope.assets = response.data;
      $scope.assets_slice = partOf($scope.assets, $scope.currentPage);
    });

    $scope.changePage = function () {
      $scope.assets_slice = partOf($scope.assets, $scope.currentPage);
    }

    $scope.fromDate = new Date();
    $scope.toDate = new Date();

    $scope.openPopupFromDate = function () {
      $scope.popupFromDate.opened = true;
    }

    $scope.openPopupToDate = function () {
      $scope.popupToDate.opened = true;
    }

  });
