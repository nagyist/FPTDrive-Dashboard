// Bus Factory

angular.module('fptdriveApp').factory('BusFactory', ['$http', '$q', 'GeoCalc',
function($http, $q, GeoCalc) {
	var polylines_record = ['acj_C{zwdSz@cCBc@AO]g@m@[c@a@OWIYo@aCOw@a@gGg@_Gc@cEq@}F[wCQ_C}EeAuA]uEaAq@EW@eCq@qDaAaBYsA_@wEy@eAWwB]yHcBgJmBmDu@QYQo@BaHIOCA?g@{EVo@FIi@MiB?u@HqCh@kGLaA', 
	'mci_CmhxdS`@eDLyAh@oDn@yFdAf@vKbFHCBGBU?KoCoA}E{B_FaC{IeEeAq@_Bm@iDs@}Ci@kB[{C[}@G{Cg@gCk@}HcBk@K_@Ou@SyA]wHsBaBYu@U]I', 
	'ouh_CscqdSp@@LHDV@~KeAZs@\\QLGNUp@[CoJs@]IaASaF_Bs@Uk@]SGW@SH[A}EiAk@QOOMSWKW?UFKHW?]EkBi@cDu@uDk@gHcAsFs@g@EiFeA{Ae@cBu@wKkFWM?EOYUu@A[CE~@qFbAqF~BeLPoAXmGL}GDwBYEWC[Fq@@aBEaDMmBG{A?I?C@SLK?{DAsBAwAGc@s@Q]JmGJaGPqR@mJAoH@}GEyI?aD{BiFuB{E@uAGkAByGhDE', 
	'yug_CwprdS|@pAJBLEXS^n@dE_D\\WxG`Kr@hAdI`MPj@ADAL?FWd@yRbOwHtE_GrEs@`@M@[NiA^kAPyC^qBLcDAQASB{E?kKw@_B]}FkBu@[IGSIUAUHQ@]GeFkA_@QMWSMYCWFIDEDI@[C{Bm@_FgAeEm@yL_Bm@GiEw@uBk@qAg@mFmCiFcCCM_@y@C[CSnAiHbAkFe@SYhAeApFoO{DaHsAx@yDd@kCP_B@Y?]He@hAaFViBFqB'];

	var routes = [];

	var selectedBusID = undefined;
	for (var i = 0; i < polylines_record.length; i++) {
		routes.push(GeoCalc.polyline_decode(polylines_record[i]));
	};

	return {
		getBusDict : function() {
			$http.get("/api/bus").then(function(res) {

				var busData = res.data;
				console.log(busData);
				var busDictionary = {};
				for (var i = 0; i < busData.length; ++i) {
					busDictionary[busData[i].id] = busData[i].bus_id;
				}
				console.log(busDictionary);
				return busDictionary;
			}, function(err) {
				return err;
				console.log(err);
			});

		},
		setSelectedBusID : function(id) {
			selectedBusID = id;
		},
		getSelectedBusID : function() {
			if (selectedBusID == undefined) {
				return 0;
			} else
				return (parseInt(selectedBusID) - 1);
		},
		getPolyRoute : function(busId) {
			//console.log("BusFactory getPolyRoute " + busId);
			if (busId >= 0)
				return polylines_record[busId];
			return [];
		},
		getRoute : function(busId) {
			//console.log("BusFactory getRoute " + busId);
			if (busId >= 0)
				return routes[busId];
			return [];
		}
	};
}]);
