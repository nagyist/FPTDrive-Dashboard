//simulate GPS
var fpt = require("fptdrive");
var buses = [
	require('./data/01/bus_data_01.json'),
	require('./data/02/bus_data_02.json'),
	require('./data/03/bus_data_03.json'),
	require('./data/04/bus_data_04.json')
];

//console.log(JSON.stringify(buses));

// var polylines_record = [
// //'acj_C{zwdSz@cCBc@AO]g@m@[c@a@OWIYo@aCOw@a@gGg@_Gc@cEq@}F[wCQ_C}EeAuA]uEaAq@EW@eCq@qDaAaBYsA_@wEy@eAWwB]yHcBgJmBmDu@QYQo@BaHIOCA?g@{EVo@FIi@MiB?u@HqCh@kGLaA', 
// 'cdi_CcexdSj@iEX_Dh@oDn@yFxDjBbElBzDbB~Az@@ARi@u@_@UmApAaDrD}Jf@{AbEaKt@}BlAkCdFoInCgEtCeErFmIhCkCtCeCtBuB~AyAn@aAN[f@wAZ_@pAmBTcATwARo@N]hAiDbC{GfAgDf@mADQt@oBfCgGFUSMmB}Ba@m@_@c@oD}EcAmAOMGAi@m@oBoC}AmBsAsBcByB[YQm@AO?e@bCwApA{@TSDMzEiFf@u@\\q@b@eA`@}AVoAPeC?{@C_CGqB[_G?SFUu@cLoAcM]oFG_DBoAgBGqCCwJa@kHSeA@{HZgIh@mBGwD[oCc@wRoCuBSyDk@mBUuF_A{B[cPuA',
// 'mci_CmhxdS`@eDLyAh@oDn@yFdAf@vKbFHCBGBU?KoCoA}E{B_FaC{IeEeAq@_Bm@iDs@}Ci@kB[{C[}@G{Cg@gCk@}HcBk@K_@Ou@SyA]wHsBaBYu@U]I', 
// 'ouh_CscqdSp@@LHDV@~KeAZs@\\QLGNUp@[CoJs@]IaASaF_Bs@Uk@]SGW@SH[A}EiAk@QOOMSWKW?UFKHW?]EkBi@cDu@uDk@gHcAsFs@g@EiFeA{Ae@cBu@wKkFWM?EOYUu@A[CE~@qFbAqF~BeLPoAXmGL}GDwBYEWC[Fq@@aBEaDMmBG{A?I?C@SLK?{DAsBAwAGc@s@Q]JmGJaGPqR@mJAoH@}GEyI?aD{BiFuB{E@uAGkAByGhDE', 
// 'yug_CwprdS|@pAJBLEXS^n@dE_D\\WxG`Kr@hAdI`MPj@ADAL?FWd@yRbOwHtE_GrEs@`@M@[NiA^kAPyC^qBLcDAQASB{E?kKw@_B]}FkBu@[IGSIUAUHQ@]GeFkA_@QMWSMYCWFIDEDI@[C{Bm@_FgAeEm@yL_Bm@GiEw@uBk@qAg@mFmCiFcCCM_@y@C[CSnAiHbAkFe@SYhAeApFoO{DaHsAx@yDd@kCP_B@Y?]He@hAaFViBFqB'];
// var route = fpt.polyline_decode(polylines_record[0]);
// var dRoute = [];
// for (var i = 0; i < 4; i++) {
	// dRoute.push(fpt.geo_detailize(polylines_record[i], 5, "K", 0.01));
// }

var dRoute = [];
var cIdx = [0, 0, 0, 0];
var cRouteIndex = [0,0,0,0];
var gps_sensor, reset_status;

exports.simulate_gps = function(io) {
	buses.forEach(function(elm, idx, arr){
		elm.routes.ab.route_detail = fpt.geo_detailize(elm.routes.ab.route_polyline, 5, "K", 0.01);
		elm.routes.ba.route_detail = fpt.geo_detailize(elm.routes.ba.route_polyline, 5, "K", 0.01);
	});

	buses.forEach(function(elm, idx, arr){
		dRoute[idx] = elm.routes.ab.route_detail;
	});

	setInterval(function() {
		for (var i = 0; i < 4; i++) {
			gps_sensor = {
				"device_id" : buses[i].info.serial,
				"timestamp" : new Date(),
				"latitude" : dRoute[i][cIdx[i]].latitude,
				"longitude" : dRoute[i][cIdx[i]].longitude,
				"direction": cRouteIndex[i]
			};
			io.emit('/fptdrive/gps', gps_sensor);
			cIdx[i] = (cIdx[i] + 1) % dRoute[i].length;
			
			if (cIdx[i] == 0) {				
				//change route
				cRouteIndex[i] = (cRouteIndex[i] + 1) % 2;	
				if (cRouteIndex[i] == 0) {
					dRoute[i] = buses[i].routes.ab.route_detail;
				} else {
					dRoute[i] = buses[i].routes.ba.route_detail;
				}
				console.log("BUS ", i, "Changed route", cRouteIndex[i]);
				
				reset_status = {
					"device_id" : buses[i].info.serial,
					"timestamp" : new Date(),
					"direction": cRouteIndex[i]
				};
				io.emit('/fptdrive/status/reset', gps_sensor);
			}
		}
	}, 1000);
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
