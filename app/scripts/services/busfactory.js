// Bus Factory

angular.module('fptdriveApp').
factory('BusFactory', ['$http', '$q', function($http, $q) {
  var selectedBusID = undefined;

  return {
    getBusDict: function () {
    	$http.get("/api/bus").then( 
	  		function(res){
	  			
	  			var busData = res.data;
	  			console.log(busData);
	  			var busDictionary = {};
	  			for(var i = 0; i < busData.length; ++i){
	  				busDictionary[busData[i].id] = busData[i].bus_id;
	  			}
	  			console.log(busDictionary);
	  			return busDictionary;
	  		}, 
	  		function(err){
	  			return err;
	  			console.log(err);
	  		}
	  	);

    },
    setSelectedBusID: function(id) {
	 	selectedBusID = id;
	},
	getSelectedBusID: function() {
		if( selectedBusID == undefined) {
			return 0;
		} else return (parseInt(selectedBusID) - 1);
	} 
  };
}]);
