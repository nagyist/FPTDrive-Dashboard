angular.module('fptdriveApp').factory('GeoCalc', ['$rootScope',
function($rootScope) {
	var funcs = {};
	funcs.get_nearest_point = function(lat,lon,route){
		var nearest1;
		var tmp, idx1;
		for(var i=0;i<route.length -1;i++) {
			tmp = funcs.pDistance(lat,lon,route[i][0],route[i][1],route[i+1][0],route[i+1][1]);
			if (typeof nearest1 == 'undefined' || tmp[2] < nearest1[2]) {
				nearest1 = tmp;
				idx1 = i;
				if (nearest1[2] < 1.0e-6) return [nearest1, idx1];//km :)
			}
			
		}
		return [nearest1, idx1];
	};
	
	funcs.pDistance = function(x, y, x1, y1, x2, y2) {
		var A = x - x1;
		var B = y - y1;
		var C = x2 - x1;
		var D = y2 - y1;

		var dot = A * C + B * D;
		var len_sq = C * C + D * D;
		var param = -1;
		if (len_sq !== 0)//in case of 0 length line
			param = dot / len_sq;

		var xx,
		    yy;

		if (param < 0) {
			xx = x1;
			yy = y1;
		} else if (param > 1) {
			xx = x2;
			yy = y2;
		} else {
			xx = x1 + param * C;
			yy = y1 + param * D;
		}

		var dx = x - xx;
		var dy = y - yy;
		return [xx, yy, Math.sqrt(dx * dx + dy * dy)];
	};

	funcs.geo_distance = function(lat1, lon1, lat2, lon2, unit) {
		var radlat1 = Math.PI * lat1 / 180;
		var radlat2 = Math.PI * lat2 / 180;
		var theta = lon1 - lon2;
		var radtheta = Math.PI * theta / 180;
		var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
		dist = Math.acos(dist);
		dist = dist * 180 / Math.PI;
		dist = dist * 60 * 1.1515;
		if (unit == "K") {
			dist = dist * 1.609344;
		}
		if (unit == "N") {
			dist = dist * 0.8684;
		}
		return dist;
	};

	funcs.geo_divider = function(lat1, lon1, lat2, lon2, unit, divider) {
		var total = funcs.geo_distance(lat1, lon1, lat2, lon2, unit);
		if (total <= divider) {
			return [1, lat2 - lat1, lon2 - lon1];
		}

		var count = total / divider - 1;
		return [count, (lat2 - lat1) / count, (lon2 - lon1) / count];
	};

	funcs.geo_detailize = function(str, precision, unit, divider) {
		var out = [];
		var coords = funcs.polyline_decode(str, precision);
		var adivider;
		var xx,
		    yy;
		coords.forEach(function(elm, idx, arr) {
			if (idx < arr.length - 1) {
				adivider = funcs.geo_divider(arr[idx][0], arr[idx][1], arr[idx+1][0], arr[idx+1][1], unit, divider);
				console.log("adivider : " + JSON.stringify(adivider));
				xx = arr[idx][0];
				yy = arr[idx][1];

				for ( i = 0; i < adivider[0]; i++) {
					out.push({
						latitude : xx,
						longitude : yy
					});
					xx += adivider[1];
					yy += adivider[2];
				}
			}

		});
		console.log(JSON.stringify(out));
		return out;
	};

	funcs.polyline_decode_geotracks = function(str, precision) {
		//console.log("socketfactory polyline_decode_geotracks: " + str);
		var arr = funcs.polyline_decode(str, precision);
		var out = [];
		arr.forEach(function(element, index, array) {
			out.push({
				latitude : arr[index][0],
				longitude : arr[index][1]
			});
		});
		return out;
	};

	funcs.polyline_decode = function(str, precision) {
		//console.log("polyline_decode " + str);
		var index = 0,
		    lat = 0,
		    lng = 0,
		    coordinates = [],
		    shift = 0,
		    result = 0,
		    byte = null,
		    latitude_change,
		    longitude_change,
		    factor = Math.pow(10, precision || 5);

		// Coordinates have variable length when encoded, so just keep
		// track of whether we've hit the end of the string. In each
		// loop iteration, a single coordinate is decoded.
		while (index < str.length) {

			// Reset shift, result, and byte
			byte = null;
			shift = 0;
			result = 0;

			do {
				byte = str.charCodeAt(index++) - 63;
				result |= (byte & 0x1f) << shift;
				shift += 5;
			} while (byte >= 0x20);

			latitude_change = ((result & 1) ? ~(result >> 1) : (result >> 1));

			shift = result = 0;

			do {
				byte = str.charCodeAt(index++) - 63;
				result |= (byte & 0x1f) << shift;
				shift += 5;
			} while (byte >= 0x20);

			longitude_change = ((result & 1) ? ~(result >> 1) : (result >> 1));

			lat += latitude_change;
			lng += longitude_change;

			coordinates.push([lat / factor, lng / factor]);
		};

		return coordinates;
	};

	funcs.geo_distance = function(lat1, lon1, lat2, lon2, unit) {
		var radlat1 = Math.PI * lat1 / 180;
		var radlat2 = Math.PI * lat2 / 180;
		var theta = lon1 - lon2;
		var radtheta = Math.PI * theta / 180;
		var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
		dist = Math.acos(dist);
		dist = dist * 180 / Math.PI;
		dist = dist * 60 * 1.1515;
		if (unit == "K") {
			dist = dist * 1.609344;
		}
		if (unit == "N") {
			dist = dist * 0.8684;
		}
		return dist;
	};
	
	funcs.distanceOnRoute = function(x1, y1, x2, y2, route) {
		if (typeof route === 'undefined') return -1;
		var dis = -1;
		//passed loc
		var i = 0;
		var j = route.length - 1;
		var ii = funcs.get_nearest_point(x1, y1, route);
		var jj = funcs.get_nearest_point(x2, y2, route);
	
		// console.log("Nearest index i: ", ii);
		// console.log("Nearest index j: ", jj);
		i = ii[1];
		j = jj[1] + 1;
		if (i < j-1) {
			dis = 0;
			for (var k = i + 1; k < j; k++) {
				dis += funcs.geo_distance(x1, y1, route[k][0], route[k][1], "K");
				x1 = route[k][0];
				y1 = route[k][1];
			}
			dis += funcs.geo_distance(route[j-1][0], route[j-1][1], x2, y2, "K");
		} else {
			//
			dis = funcs.geo_distance(x1, y1, x2, y2, "K");
		}
	
		if (dis == -1) {
			dis = {
				error: "passed",
				distance: funcs.geo_distance(x1, y1, x2, y2, "K")
			};
		}
		
		return dis;
	};
	return funcs;

}]);