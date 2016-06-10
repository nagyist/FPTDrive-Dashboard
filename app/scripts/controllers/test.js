'use strict';



/**
 * @ngdoc function
 * @name fptdriveApp.controller:TestCtrl
 * @description
 * # TestCtrl
 * Controller of the fptdriveApp
 */

angular.module('fptdriveApp').
controller('TestCtrl', [
    '$scope', 
    '$interval', 
    function($scope, $interval){
    
    $scope.map = {
      center: {
        latitude: 40.1451,
        longitude: -99.6680
      },
      zoom: 4,
      bounds: {}
    };
    $scope.options = {
      scrollwheel: false
    };
    var createRandomMarker = function(i, bounds, idKey) {
      var lat_min = bounds.southwest.latitude,
        lat_range = bounds.northeast.latitude - lat_min,
        lng_min = bounds.southwest.longitude,
        lng_range = bounds.northeast.longitude - lng_min;

      if (idKey == null) {
        idKey = "id";
      }

      var latitude = lat_min + (Math.random() * lat_range);
      var longitude = lng_min + (Math.random() * lng_range);
      var ret = {
        latitude: latitude,
        longitude: longitude,
        title: 'm' + i
      };
      ret[idKey] = i;
      return ret;
    };
    $scope.randomMarkers = [];
    // Get the bounds from the map once it's loaded
    $scope.$watch(function() {
      return $scope.map.bounds;
    }, function(nv, ov) {
      // Only need to regenerate once
      if (!ov.southwest && nv.southwest) {
        var markers = [];
        for (var i = 0; i < 10; i++) {
          markers.push(createRandomMarker(i, $scope.map.bounds))
        }
        $scope.randomMarkers = markers;
      }
    }, true);

    // if( typeof _.contains === 'undefined' ) {
    //     _.contains = _.includes;
    //     _.prototype.contains = _.includes;
    // }
    // if( typeof _.object === 'undefined' ) {
    //     _.object = _.zipObject;
    // }
}]);