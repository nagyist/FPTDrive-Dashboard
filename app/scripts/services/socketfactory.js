angular.module('fptdriveApp').factory('SocketFactory', ['$rootScope',
function($rootScope) {
	var socket = io.connect();

	return {
		on : function(eventName, callback) {
			socket.on(eventName, callback);
		},
		emit : function(eventName, data) {
			socket.emit(eventName, data);
		}
	};
}]);
