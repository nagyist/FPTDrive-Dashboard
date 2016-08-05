'use strict';

/**
 * @ngdoc function
 * @name fptdriveApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the fptdriveApp
 */
angular.module('fptdriveApp').controller('MonitoringCtrl', ['$scope', '$location', '$anchorScroll', '$interval', 'uiGmapGoogleMapApi', 
	'SocketFactory', 'DeviceFactory', 'BusFactory', 'GeoCalc', '$http','$filter',
function($scope, $location, $anchorScroll, $interval, uiGmapGoogleMapApi, SocketFactory, DeviceFactory, BusFactory, GeoCalc, $http, $filter) {
	this.awesomeThings = ['HTML5 Boilerplate', 'AngularJS', 'Karma'];
	var bus_selected_index;
	console.log("Init MonitoringCtrl " + bus_selected_index);
	
	$scope.options = {
		draggable : false,
		scrollwheel : false
	};

	$scope.updateBusId = function() {
		console.log("$scope.updateBusId: " + JSON.stringify($scope.selectedBusID));
		bus_selected_index = $scope.selectedBusID.id - 1;
		
		//change to route_id later
		$http.get("/api/bus/route/0" + (bus_selected_index+1)).then(function(res) {
			//console.log("monitoring: " + JSON.stringify(res.data.routes.ab));
			$scope.bus_all_info = res.data;
			
			$scope.map.polygons = [];//.splice(0, 1)
			$scope.map.polygons.push({
				id : bus_selected_index + 1,
				//geotracks : GeoCalc.polyline_decode_geotracks(BusFactory.getPolyRoute(bus_selected_index)),
				geotracks : GeoCalc.polyline_decode_geotracks($scope.bus_all_info.routes.ab.route_polyline),
				clickable : true,
				visible : true
			});
			
			$scope.map.polygons.push({
				id : (bus_selected_index + 1)*3,
				//geotracks : GeoCalc.polyline_decode_geotracks(BusFactory.getPolyRoute(bus_selected_index)),
				geotracks : GeoCalc.polyline_decode_geotracks($scope.bus_all_info.routes.ba.route_polyline),
				clickable : true,
				visible : true
			});
			
			$scope.route_ab = GeoCalc.polyline_decode($scope.bus_all_info.routes.ab.route_polyline);
			$scope.route_ba = GeoCalc.polyline_decode($scope.bus_all_info.routes.ab.route_polyline);
			
			$scope.direction = 0;
			$scope.route = $scope.route_ab;
			
			$scope.route_ab.forEach(function(element, index, arr){
				if (index < arr.length -1){
					arr[index].push(GeoCalc.geo_distance(arr[index][0], arr[index][1],arr[index + 1][0],arr[index + 1][1],"K"));
				} else {
					arr[index].push(0);
				}
			});

			$scope.route_ba.forEach(function(element, index, arr){
				if (index < arr.length -1){
					arr[index].push(GeoCalc.geo_distance(arr[index][0], arr[index][1],arr[index + 1][0],arr[index + 1][1],"K"));
				} else {
					arr[index].push(0);
				}
			});
			
			
			
			$scope.lat_end = $scope.route[$scope.route.length -1][0];
			$scope.lon_end = $scope.route[$scope.route.length -1][1];
					
			_markers.forEach(function(element, index, array) {
				element.latitude = 0;
				element.longitude = 0;
			});
			$scope.bus_all_info.routes.ab.bus_stop.forEach(function(element, index, array){
				_markers[index].latitude = element.latitude;
				_markers[index].longitude = element.longitude;
			});
			$scope.bus_all_info.routes.ba.bus_stop.forEach(function(element, index, array){
				_markers[$scope.bus_all_info.routes.ab.bus_stop.length + index].latitude = element.latitude;
				_markers[$scope.bus_all_info.routes.ab.bus_stop.length + index].longitude = element.longitude;
			});
		});
		
		
		 
		
		$scope.bus_info = DeviceFactory.getBusInfo(bus_selected_index);
		$scope.nextBusStop = null;
		console.log("Update BUS ID " + (bus_selected_index) + "(lat;lon) = " + $scope.lat_end + ";" + $scope.lon_end);
	};

	$http.get("/api/bus").then(function(res) {
		console.log(res);
		$scope.busDictionary = res.data;
		var budSelectedID = BusFactory.getSelectedBusID();
		$scope.selectedBusID = $scope.busDictionary[budSelectedID];
		bus_selected_index = $scope.selectedBusID.id - 1;
		$scope.route = BusFactory.getRoute(bus_selected_index);
		$scope.lat_end = $scope.route[$scope.route.length -1][0];
		$scope.lon_end = $scope.route[$scope.route.length -1][1]; 
		$scope.bus_info = DeviceFactory.getBusInfo(bus_selected_index);
		$scope.updateBusId();
	}, function(err) {
		return err;
		console.log(err);
	});

	var _marker = {
		id : 0,
		coords : {
			latitude : 0,
			longitude : 0
		},
		options : {
			draggable : false,
			icon : {
				url : '/images/bus.png',
				scaledSize : {
					width : 25,
					height : 25
				}
			}
		},

	};

	$scope.marker = _marker;

	var _markers = [];
	for (var i =0; i< 100;i++) _markers.push({id:i,latitude:0,longitude:0,icon:{url:"/images/bus-red.png",scaledSize:{width:10,height:10}}});
    $scope.markers = _markers;
    
	$scope.map = {
		center : $scope.marker.coords,
		zoom : 18,//16,
		bounds : {},
		polygons : [{
			id : 1,
			geotracks : GeoCalc.polyline_decode_geotracks(BusFactory.getPolyRoute($scope.selectedBusID))
		}],
		lineStyle : {
			color : '#333',
			weight : 5,
			opacity : 0.7
		},
	};

	$scope.nextBusStop = null;
	
	//console.log(JSON.stringify($scope.map.polygons[0].geotracks));
	$scope.chartOptions = {
		scaleShowGridLines : true,
		bezierCurve : false,
		animation : false,
		// Boolean - Whether the scale should stick to integers, not floats even if drawing space is there
		scaleOverride : true,
		scaleSteps : 10,
		scaleStepWidth : 4,
		scaleStartValue : 0,
		scaleIntegersOnly : false
	};
	$scope.passengerChartOptions = {
		scaleShowVerticalLines : true,
		scaleShowHorizontalLines : false,
		bezierCurve : false,
		animation : false,
		// Boolean - Whether the scale should stick to integers, not floats even if drawing space is there
		scaleOverride : true,
		scaleSteps : 10,
		scaleStepWidth : 1,
		scaleStartValue : 0,
		scaleIntegersOnly : false
	};
	$scope.fuelChartOptions = {
		scaleShowGridLines : true,
		bezierCurve : false,
		animation : false,
		// Boolean - Whether the scale should stick to integers, not floats even if drawing space is there
		scaleOverride : true,
		scaleSteps : 10,
		scaleStepWidth : 6,
		scaleStartValue : 0,
		scaleIntegersOnly : false
	};

	$scope.humidChartOptions = {
		scaleShowGridLines : true,
		bezierCurve : false,
		animation : false,
		// Boolean - Whether the scale should stick to integers, not floats even if drawing space is there
		scaleOverride : true,
		scaleSteps : 10,
		scaleStepWidth : 10,
		scaleStartValue : 0,
		scaleIntegersOnly : false
	};

	$scope.distanceChartOptions = {
		scaleShowGridLines : true,
		bezierCurve : false,
		animation : false,
		// Boolean - Whether the scale should stick to integers, not floats even if drawing space is there
		scaleOverride : true,
		scaleSteps : 10,
		scaleStepWidth : 6,
		scaleStartValue : 0
	};

	$scope.timelabel = ['', '', '', '', '', '', '', '', '', ''];
	$scope.pasengerData = [[5, 4, 5, 4, 3, 2, 1, 0, 5, 1], [5, 2, 3, 5, 2, 5, 1, 0, 3, 2]];
	$scope.temperatureData = [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0]];

	$scope.fuelData = [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
	// [51, 51, 51, 50, 50, 50, 49, 49, 48, 48]
	];

	$scope.humidData = [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
	// [51, 51, 51, 50, 50, 50, 49, 49, 48, 48]
	];

	$scope.distanceData = [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
	// [51, 51, 51, 50, 50, 50, 49, 49, 48, 48]
	];

	$scope.passengerColours = [
	// '#ff76a5', // red
	'#9dd6d6' // green
	];
	$scope.fuelColours = ['#97bbcd'];
	$scope.humidColours = ['#9dd6d6'];

	$scope.distanceColours = ['#ffb6c1'];

	$scope.tempColours = ['#ff76a5'];


	$scope.speedChartOptions = {
		scaleShowGridLines : true,
		bezierCurve : false,
		animation : false,
		// Boolean - Whether the scale should stick to integers, not floats even if drawing space is there
		scaleOverride : true,
		scaleSteps : 10,
		scaleStepWidth : 10,
		scaleStartValue : 0
	};

	$scope.speedData = [
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // Average Speed
		[61, 61, 61, 55, 55, 46, 46, 50, 60, 70, 80, 60, 50, 55] // Max Speed
	];

	$scope.timeOfDay = ['', '', '', '', '', '', '', '', '', '', '', '', '', ''];
	$scope.speedColours = ['#009999', '#ff6600']; 
    $scope.busSpeed = 30.0;
    $scope.maxSpeed = 45.0;
	
	$interval(function() {
		var timestamp = Date.now();
		timestamp = $filter('date')(timestamp, "H:mm:ss");
		// timestamp = $filter('date')(timestamp, "mediumTime");
		$scope.timeOfDay.shift();
		$scope.timeOfDay.push(timestamp);

		var busSpeed = parseFloat($scope.busSpeed - Math.random() * 1.5 + Math.random() * 1.5).toFixed(2);
		$scope.speedData[0].shift();
		$scope.speedData[0].push(busSpeed);

		// var maxSpeed = parseFloat(busSpeed + Math.random()*5).toFixed(2);
		var maxSpeed = $scope.speedData[1][0];
		$scope.speedData[1].shift();
		$scope.speedData[1].push(maxSpeed);

		$scope.busSpeed = busSpeed;
		$scope.maxSpeed = maxSpeed;

	}, 3000); 


	$scope.totalPassenger = 32;
	$scope.busTemperature = 20;
	$scope.busFuel = 48;
	$scope.humidityNow = 50.0;
	$scope.distanceNow = 10.0;
	$scope.gotoPart = function(id) {
		$location.hash(id);
		$anchorScroll();
	};

	$scope.onClick = function(points, evt) {
		console.log(points, evt);
	};

	$interval(function() {
		// var passengerIn = parseInt(Math.random() * 5);
		// var passengerOut = parseInt(Math.random() * 5);
		// $scope.pasengerData[0].shift();
		// $scope.pasengerData[0].push(passengerIn);
		// $scope.pasengerData[1].shift();
		// $scope.pasengerData[1].push(passengerOut);
		// $scope.totalPassenger = $scope.totalPassenger + passengerIn - passengerOut;

		//     // var engineTemperature = parseInt(Math.random() * 2) + 66;
		//     // var busTemperature = 15 + 19;
		//     // $scope.temperatureData.shift();
		//     // $scope.temperatureData.push(busTemperature);
		//     // $scope.busTemperature = busTemperature;

		var busFuel = parseFloat($scope.busFuel - Math.random() / 5).toFixed(2);
		$scope.fuelData[0].shift();
		$scope.fuelData[0].push(busFuel);
		$scope.busFuel = busFuel;

		//     var timestamp = Math.floor(Date.now() / 1000);
		//     $scope.timelabel.shift();
		//     $scope.timelabel.push(timestamp);

	}, 1000);

	SocketFactory.on('/fptdrive/environment', function(msg) {
		msg = msg.replace(/\'/g, '"');

		var data = angular.fromJson(msg);

		var busId = DeviceFactory.getBus(data.device_id);
		if (busId == parseInt($scope.selectedBusID.id)) {
			var temperature = Math.round(data.temperature * 100) / 100;
			var humidity = Math.round(data.humidity * 100) / 100;
			var atmosphere = data.atmosphere;
			var light = data.light;
			var timestamp = data.timestamp;

			$scope.timelabel.shift();
			$scope.timelabel.push(timestamp);

			$scope.temperatureData[0].shift();
			$scope.temperatureData[0].push(temperature);
			$scope.busTemperature = temperature;

			$scope.humidData[0].shift();
			$scope.humidData[0].push(humidity);
			$scope.humidityNow = humidity;
		}
	});

	SocketFactory.on('/fptdrive/cardistance', function(msg) {
		if (typeof $scope.selectedBusID == 'undefined') return;
		if (typeof msg ===  'string')
			msg = msg.replace(/\'/g, '"');
		var data = angular.fromJson(msg);
		var busId = DeviceFactory.getBus(data.device_id);
		if (busId == parseInt($scope.selectedBusID.id)) {
			var distance_to_next = Math.round(data.distance_to_next * 100) / 100;

			$scope.distanceData[0].shift();
			$scope.distanceData[0].push(distance_to_next);
			$scope.distanceNow = distance_to_next;
		}
	});

	SocketFactory.on('/fptdrive/status/reset', function(msg) {
		if (typeof $scope.selectedBusID == 'undefined') return;
		
		//console.log('/fptdrive/gps: ' + JSON.stringify(msg));
		if ( typeof msg === 'string')
			msg = msg.replace(/\'/g, '"');
		var data = angular.fromJson(msg);
		var busId = DeviceFactory.getBus(data.device_id);
		
		if (busId == parseInt($scope.selectedBusID.id)) {
			$scope.nextBusStop = null;
			console.log("Monitoring: Reset status");
			
			if (data.direction == 0) {
				$scope.route = $scope.route_ab;
			} else {
				$scope.route = $scope.route_ba;
			}
		}
	});
	SocketFactory.on('/fptdrive/gps', function(msg) {
		if (typeof $scope.selectedBusID == 'undefined') return;
		
		//console.log('/fptdrive/gps: ' + JSON.stringify(msg));
		if ( typeof msg === 'string')
			msg = msg.replace(/\'/g, '"');
		var data = angular.fromJson(msg);
		var busId = DeviceFactory.getBus(data.device_id);
		var dis, lat, lng, direction;
		//console.log('/fptdrive/gps:  ' + ($scope.selectedBusID.id) + " - " + busId + " - " + bus_selected_index);
		if (busId == parseInt($scope.selectedBusID.id)) {
			lat = data.latitude;
			lng = data.longitude;
			direction = data.direction;
			if ($scope.direction != direction) {
				$scope.direction = direction;
				if (direction == 0) {
					$scope.route = $scope.route_ab;
				} else {
					$scope.route = $scope.route_ba;
				}
			}
			_marker.coords.latitude = parseFloat(data.latitude);
			_marker.coords.longitude = parseFloat(data.longitude);
			//console.log('/fptdrive/gps:  ' + ($scope.selectedBusID.id) + " - " + busId);
			dis = GeoCalc.distanceOnRoute(lat, lng, $scope.lat_end, $scope.lon_end, $scope.route) ;//Math.random()%1000;
			dis = Math.floor(dis * 1000) / 1000;
			$scope.distance_to_end = dis;
			
			if ($scope.bus_all_info) {
				var bs;
				if (direction == 0) {
					bs = $scope.bus_all_info.routes.ab.bus_stop;
				} else {
					bs = $scope.bus_all_info.routes.ba.bus_stop;
				}
				 
				if ($scope.nextBusStop == null) {
					for (var i = 0; i< bs.length; i++)
						if (GeoCalc.distanceOnRoute(bs[i].latitude, bs[i].longitude, $scope.lat_end, $scope.lon_end, $scope.route) < $scope.distance_to_end) {
							console.log("Next bus stop 1: " + bs[i].name + " - " + bs[i].id);
							$scope.nextBusStop = i;
							break;
						}
				} else if (GeoCalc.distanceOnRoute(bs[$scope.nextBusStop].latitude, bs[$scope.nextBusStop].longitude, $scope.lat_end, $scope.lon_end, $scope.route) > $scope.distance_to_end) {
						if ($scope.nextBusStop < bs.length - 1) {
							$scope.nextBusStop++;
						}
						console.log("Next bus stop 2: " + bs[$scope.nextBusStop].name + " - " + bs[$scope.nextBusStop].id);
				}
				if ($scope.nextBusStop){
					$scope.next_bus_stop_name = bs[$scope.nextBusStop].name;
					$scope.next_bus_stop_des = bs[$scope.nextBusStop].des;
					dis = GeoCalc.distanceOnRoute(lat, lng, bs[$scope.nextBusStop].latitude, bs[$scope.nextBusStop].longitude, $scope.route);
					//console.log(dis);
					if (!isNaN(parseFloat(dis)) && isFinite(dis))
						$scope.next_bus_stop_distance = dis.toFixed(3);
				}
			}
		};
		
		
		
	});
	
	$scope.doorstate = {};
	$scope.doorstate.timestamp;
	$scope.doorstate.shortstate;
	$scope.doorstate.longstate;

	SocketFactory.on('/fptdrive/doorstatus', function(msg) {
		//console.log('/fptdrive/doorstatus' + JSON.stringify(msg));

		// msg = msg.replace(/\'/g, '"');
		var data = angular.fromJson(msg);
		var busId = DeviceFactory.getBus(data.device_id);
		if (busId == parseInt($scope.selectedBusID.id)) {
			$scope.doorstate.timestamp = data.timestamp;
			if (data.is_open == 0) {
				$scope.doorstate.shortstate = "O";
				$scope.doorstate.longstate = "Open";
			} else {
				$scope.doorstate.shortstate = "C";
				$scope.doorstate.longstate = "Close";
			}
		}
	});

	$scope.facerg = {};
	$scope.facerg.timestamp;
	$scope.facerg.yawn = {};
	$scope.facerg.eye_blink = {};
	$scope.facerg.drowsiness = {};

	$scope.facerg.yawn.shortstate;
	$scope.facerg.yawn.longstate;
	$scope.facerg.eye_blink.shortstate;
	$scope.facerg.eye_blink.longstate;
	$scope.facerg.drowsiness.shortstate;
	$scope.facerg.drowsiness.longstate;

	SocketFactory.on('/fptdrive/face', function(msg) {
		if (typeof $scope.selectedBusID == 'undefined') return;
		if (typeof msg ===  'string')
			msg = msg.replace(/\'/g, '"');
		var data = angular.fromJson(msg);
		var busId = DeviceFactory.getBus(data.device_id);
		if (busId == parseInt($scope.selectedBusID.id)) {
			// parse data.
			//{ yawn , eye_blink, drowsiness}
			$scope.facerg.timestamp = data.timestamp;
			$scope.facerg.yawn.longstate = (data.yawn == 0) ? "Yes" : "No";
			$scope.facerg.eye_blink.longstate = (data.eye_blink == 0) ? "Yes" : "No";
			$scope.facerg.drowsiness.longstate = (data.drowsiness == 0) ? "Yes" : "No";
			$scope.facerg.yawn.shortstate = $scope.facerg.yawn.longstate.charAt(0);
			$scope.facerg.eye_blink.shortstate = $scope.facerg.eye_blink.longstate.charAt(0);
			$scope.facerg.drowsiness.shortstate = $scope.facerg.drowsiness.longstate.charAt(0);
		}
	});

}]);

