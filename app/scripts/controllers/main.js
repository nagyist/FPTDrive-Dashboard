'use strict';



/**
 * @ngdoc function
 * @name fptdriveApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the fptdriveApp
 */

angular.module('fptdriveApp').
controller('MainCtrl', [
    '$scope',
    '$interval',
    'SocketFactory',
    'DeviceFactory',
    'uiGmapGoogleMapApi',
    'BusFactory',
    'GeoCalc',
    '$location',
    '$sce',
    function($scope, $interval, SocketFactory, DeviceFactory, uiGmapGoogleMapApi, BusFactory, GeoCalc, $location, $sce){


    console.log("Init MainCtrl ");
    
    $scope.map = {
        center: {
            "latitude": 21.0269591,
            "longitude": 105.803113
        },
        zoom: 14,
        bounds: {},
    };
	
    $scope.options = {
        scrollwheel: false,
        draggable: true
    };
    $scope.icons = {
        green: {
            url: '/images/bus.png',
            scaledSize: {
                width: 25,
                height: 25
            }
        },
        red: {
            url: '/images/bus-red.png',
            scaledSize: {
                width: 25,
                height: 25
            }
        },
        yellow: {
            url: '/images/bus-yellow.png',
            scaledSize: {
                width: 25,
                height: 25
            }
        }
    };

    $scope.windowOptions = {
        visible: true
    };

    $scope.onClick = function() {
        $scope.windowOptions.visible = !$scope.windowOptions.visible;
    };

    $scope.closeClick = function() {
        $scope.windowOptions.visible = false;
    };
    
    var _markers = [
      {
        id: 1,
        latitude: 0,
        longitude: 0,
        icon: $scope.icons.green,
        //markerOptions: {visible:false}
      },
      {
        id: 2,
        latitude: 0,
        longitude: 0,
        icon: $scope.icons.green,
        //markerOptions: {visible:false}
      },
      {
        id: 3,
        latitude: 0,
        longitude: 0,
        icon: $scope.icons.green,
        //markerOptions: {visible:false}
      },
      {
        id: 4,
        latitude: 0,
        longitude: 0,
        icon: $scope.icons.green,
        //markerOptions: {visible:false}
      },
    ];

    $scope.markers = _markers;

    /// #to fix issue with lodash
    if( typeof _.contains === 'undefined' ) {
        _.contains = _.includes;
        _.prototype.contains = _.includes;
    }
    if( typeof _.object === 'undefined' ) {
        _.object = _.zipObject;
    }

  var canvasWidth = 200, //width
      canvasHeight = 200,   //height
      outerRadius = 65,   //radius
      color = d3.scale.category20();
       //builtin range of colors
    var vis = d3.select('#fuel-consumtion')
      .append("svg:svg") //create the SVG element inside the <body>
        .attr("width", canvasWidth) //set the width of the canvas
        .attr("height", canvasHeight) //set the height of the canvas
        .append("svg:g") //make a group to hold our pie chart
          .attr("transform", "translate(" + 1.5*outerRadius + "," + 1.5*outerRadius + ")"); // relocate center of pie to 'outerRadius,outerRadius'



    $scope.showFuel = function(divName, data){
        var dataSet = data;

        vis.data([dataSet]);

        // This will create <path> elements for us using arc data...
        var arc = d3.svg.arc().outerRadius(outerRadius);

        var pie = d3.layout.pie() //this will create arc data for us given a list of values
          .value(function(d) { return d.magnitude; }) // Binding each value to the pie
          .sort( function(d) { return null; } );

        // Select all <g> elements with class slice (there aren't any yet)
        var arcs = vis.selectAll("g.slice")
          // Associate the generated pie data (an array of arcs, each having startAngle,
          // endAngle and value properties) 
          .data(pie)
          // This will create <g> elements for every "extra" data element that should be associated
          // with a selection. The result is creating a <g> for every object in the data array
          .enter()
          // Create a group to hold each slice (we will have a <path> and a <text>
          // element associated with each slice)
          .append("svg:g")
          .attr("class", "slice");    //allow us to style things in the slices (like text)

        arcs.append("svg:path")
          //set the color for each slice to be chosen from the color function defined above
          .attr("fill", function(d, i) { 
                return color(i); 
            } )
          //this creates the actual SVG path using the associated data (pie) with the arc drawing function
          .attr("d", arc);

        // Add a legendLabel to each arc slice...
        arcs.append("svg:text")
          .attr("transform", function(d) { //set the label's origin to the center of the arc
            //we have to make sure to set these before calling arc.centroid
            d.outerRadius = outerRadius + 50; // Set Outer Coordinate
            d.innerRadius = outerRadius + 45; // Set Inner Coordinate
            return "translate(" + arc.centroid(d) + ")";
          })
          .attr("text-anchor", "middle") //center the text on it's origin
          .style("fill", "Purple")
          .style("font", "bold 12px Arial")
          .text(function(d, i) { return dataSet[i].legendLabel; }); //get the label from our original data array

        // Add a magnitude value to the larger arcs, translated to the arc centroid and rotated.
        arcs.filter(function(d) { return d.endAngle - d.startAngle > .2; }).append("svg:text")
          .attr("dy", ".35em")
          .attr("text-anchor", "middle")
          //.attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")rotate(" + angle(d) + ")"; })
          .attr("transform", function(d) { //set the label's origin to the center of the arc
            //we have to make sure to set these before calling arc.centroid
            d.outerRadius = outerRadius; // Set Outer Coordinate
            d.innerRadius = outerRadius/2; // Set Inner Coordinate
            return "translate(" + arc.centroid(d) + ")rotate(" + angle(d) + ")";
          })
          .style("fill", "White")
          .style("font", "bold 12px Arial")
          .text(function(d) { return d.data.magnitude; });

        // Computes the angle of an arc, converting from radians to degrees.
        function angle(d) {
          var a = (d.startAngle + d.endAngle) * 90 / Math.PI - 90;
          return a > 90 ? a - 180 : a;
        }


        function arcTween(a) {
          var i = d3.interpolate(this._current, a);
          this._current = i(0);
          return function(t) {
            return arc(i(t));
          };
        }
    };

    $scope.alertMsgs = [
      {level: 'high', message: 'Bus 1 need to maintain'},
      {level: 'high', message: 'Bus 5 has accident'},
      {level: 'low', message: 'Bus 3 will be deloyed due to traffic'},
      {level: 'medium', message: 'Bus 4 will be deloyed due to traffic'}
    ];

    $scope.totalRunningBus = 4;
    $scope.acceptReportCritical =4;
    $scope.acceptReportMinnor =12;
    $scope.totalFuel= 1536;

    SocketFactory.on('notification', function(data) {
        $scope.$apply(function () {
            console.log(data);
        });

    });

    $scope.fuelDataByBus = [];

    SocketFactory.on('fuelByBus', function(dataMsg) {
        $scope.showFuel("fuel-consumtion", dataMsg);
    });

    
   // $scope.showFuel("fuel-consumtion", $scope.fuelDataByBus);

    SocketFactory.on('fuelToday', function(dataMsg) {
        
        $scope.totalFuel = dataMsg;

    });

    SocketFactory.on('/fptdrive/gps', function(msg) {
    	if (typeof msg === 'string')
        	msg = msg.replace(/\'/g, '"');
        var data = angular.fromJson(msg);
        var busId = DeviceFactory.getBus(data.device_id);
        // console.log(busId, data.latitude, data.longitude);
        _markers[busId - 1].latitude = parseFloat(data.latitude);
        _markers[busId - 1].longitude = parseFloat(data.longitude);
        // console.log($scope.markers[busId - 1]);
    });


    // uiGmapGoogleMapApi.then(function(maps) {
    //     maps.event.addListener($scope.markers[0], 'click', function(markers) {
    //         alert("Hellooo world");
    //     });
    // });

    $scope.onClickMarker = function(instance, event, marker) {
    	$scope.markers.forEach(function(item, index){
    		item.show = false;
    	}); 
		marker.show = true;
        $scope.busInfo = DeviceFactory.getBusInfo(marker.id - 1);
    };
    $interval(function(){},1000);

}]);


angular.module('fptdriveApp').
controller('infoWindowCtrl', [
  '$scope',
  '$location',
  'DeviceFactory',
  'BusFactory',
  function($scope, $location, DeviceFactory, BusFactory) {
      $scope.switchToMonitoring = function(instance, event, marker) {
        $location.path("/monitoring");
      };
      var busInfo = DeviceFactory.getCurrentBusInfo();
      $scope.busInfoOut = '';
        angular.forEach(busInfo, function(value, key) {
          //console.log(value.name + ": " + value.value);
          $scope.busInfoOut += "<strong>" + value.name + "</strong>"+ ": " + value.value + "<br>";
      });
}]);



angular.module('fptdriveApp').
filter('unsafe', [
  '$sce',
  function($sce) {
    return function(val) {
        return $sce.trustAsHtml(val);
    };
}]);
