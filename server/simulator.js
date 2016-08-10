//simulate GPS
var fpt = require("fptdrive");
var gps = require('gps-simulator/gps-simulator.js');
var gpsData = require('gps-simulator/gps-simulator-data.js');
var buses = [
	require('./data/01/bus_data_01.json'),
	require('./data/02/bus_data_02.json'),
	require('./data/03/bus_data_03.json'),
	require('./data/04/bus_data_04.json')
];


var dRoute = [];
var cIdx = [0, 0, 0, 0];
var cRouteIndex = [0, 0, 0, 0];
var gps_sensor, reset_status;


function ABus(io, busId, routeAB, routeBA, callback) {
	var _busId = busId;
	
	var gpsSimulator = new gps.GpsSimulator(routeAB, _busId);
	console.log('======================================');
	console.log(_busId + ' started route, direction: 0');
	gpsSimulator.start(function(position, beStopped) {
		gps_sensor = {
			"device_id" : _busId,
			"timestamp" : new Date(),
			"latitude" : position.latitude,
			"longitude" : position.longitude,
			"direction" : 0
		};
		io.emit('/fptdrive/gps', gps_sensor);

		if (beStopped == true) {
			console.log(_busId + ' finished route, direction: 0');
			console.log('======================================');
			
			var reset_status = {
				"device_id" : _busId,
				"timestamp" : new Date(),
				"direction": 1
			};
			io.emit('/fptdrive/status/reset', reset_status);

			var gpsSimulator2 = new gps.GpsSimulator(routeBA, _busId);
			console.log('======================================');
			console.log(_busId + ' started route, direction: 1');
			gpsSimulator2.start(function(position, beStopped) {
				gps_sensor = {
					"device_id" : _busId,
					"timestamp" : new Date(),
					"latitude" : position.latitude,
					"longitude" : position.longitude,
					"direction" : 1
				};
				io.emit('/fptdrive/gps', gps_sensor);

				if (beStopped == true) {
					console.log(_busId + ' finished route, direction: 1');
					console.log('======================================');

					if (callback) callback();
				}
			});
		}
	});
}

exports.simulate_gps = function(io) {

	for (var i = 0; i < 4; i++) {
		ABus(io, buses[i].info.serial, gpsData.routes[i].AB, gpsData.routes[i].BA, function() {
			console.log('One bus finished all routes');
		});
	}

};


exports.simulate_fuel = function(io) {
	var staticData = 1565;
	var a = 10,
	    b = 20,
	    c = 30,
	    d = 40;
	var dataSet = [{
		"legendLabel" : "Bus1",
		"magnitude" : a
	}, {
		"legendLabel" : "Bus2",
		"magnitude" : b
	}, {
		"legendLabel" : "Bus3",
		"magnitude" : c
	}, {
		"legendLabel" : "Bus4",
		"magnitude" : d
	}];
	setInterval(function() {
		staticData++;
		a++;

		if (a > 100) {
			a = 10;
		}
		dataSet[0].magnitude = a;
		dataSet[1].magnitude = b + 2;
		//console.log(a);

		io.emit('fuelToday', staticData);
		io.emit('fuelByBus', dataSet);
	}, 100);
};

exports.simulate_distance = function(io) {
	var camera_id = ["339260b3-57d4-352d-a37b-98be4445505b", 
						"b57c1702-127d-3f03-bcc0-7b27b3db5bde", 
						"ac5011da-4044-38db-974c-551129e0ffc8", 
						"c9e1b5ab-3086-3650-8e43-1fe5a314623b"];
	var msg;
	setInterval(function() {
		for (var i = 0; i < 4; i++) {
			msg = {
				"device_id" : buses[i].info.serial,
				"timestamp" : new Date(),
				"distance_to_next" : 10 + (Math.random() * 100 % 30)
			};
			io.emit('/fptdrive/cardistance', msg);
		}
	}, 1000);
};


exports.simulate_face = function(io){
	var face_id = [
	    "b281bdbc-6d96-3fc5-967c-92042163c6af",
	    "cb1e8f1e-7682-30e3-ba61-9297642cb2df",
	    "737f3355-365d-3fc1-a435-78bfbc423731",
	    "fcaf47ae-b1d5-36e4-b3f7-eec35f7c9d9d"
	    ];
    var face_sensor;
    setInterval(function(){
    	for (var i = 0; i< 4; i++) {
	    	face_sensor = {
	            "device_id": buses[i].info.serial,
	            "timestamp": new Date(),
	            "yawn": (Math.floor(Math.random() * 1000) % 50 === 0)?0:1,
	            "eye_blink": (Math.floor(Math.random() * 1000) % 10 === 0)?0:1,
	            "drowsiness": (Math.floor(Math.random() * 1000) % 30 === 0)?0:1
	       };
	        io.emit('/fptdrive/face', face_sensor);
    	}
    }, 1000);
};
