'use strict';

/**
 * @ngdoc overview
 * @name fptdriveApp
 * @description
 * # fptdriveApp
 *
 * Main module of the application.
 */
angular
    .module('fptdriveApp', [
      'ui.bootstrap',
      'ngAnimate',
      'ngCookies',
      'ngResource',
      'ngRoute',
      'ngSanitize',
      'ngTouch',
      'chart.js',
      'angular-flot',
      'uiGmapgoogle-maps',
      'angucomplete-alt',
      'btford.socket-io'
    ]).config(function(uiGmapGoogleMapApiProvider) {
    	    uiGmapGoogleMapApiProvider.configure({
		        key: 'AIzaSyA-em3ErVooX2PgREgCIlR4jSZ7mPUf20U',//fsb.fho@gmail.com
		        v: '3.17',
		        libraries: 'geometry'
		    }); 
    }).config(function($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'views/main.html',
                controller: 'MainCtrl',
                controllerAs: 'main'
            })
            .when('/alert', {
                templateUrl: 'views/alert.html',
                controller: 'AlertCtrl',
                controllerAs: 'alert'
            })
            .when('/monitoring', {
                templateUrl: 'views/monitoring.html',
                controller: 'MonitoringCtrl',
                controllerAs: 'monitoring'
            })
            .when('/routes', {
                templateUrl: 'views/route_information.html',
                controller: 'RouteInformationCtrl',
                controllerAs: 'route_information'
            })
            .when('/managedevice', {
                templateUrl: 'views/managedevice.html',
                controller: 'ManageDeviceCtrl',
                controllerAs: 'managedevice'
            })
            .when('/login', {
                templateUrl: 'views/login.html',
                controller: 'LoginCtrl',
                controllerAs: 'login'
            })
            .when('/managedevice', {
                templateUrl: 'views/managedevice.html',
                controller: 'ManageDeviceCtrl',
                controllerAs: 'manage_device'
            })
            .when('/test', {
                templateUrl: 'views/test.html',
                controller: 'TestCtrl'
            })
            .otherwise({
                redirectTo: '/'
            });
    })
    .run(['$rootScope', '$location', '$cookieStore', '$http',
        function($rootScope, $location, $cookieStore) {
            // keep user logged in after page refresh
            $rootScope.globals = $cookieStore.get('globals') || {};
            if ($rootScope.globals.currentUser) {
                // $http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata; // jshint ignore:line
            }
            $rootScope.$on('$locationChangeStart', function() {
                // redirect to login page if not logged in
                if ($location.path() !== '/login' && !$rootScope.globals.currentUser) {
                  console.log("Not found coookies");
                    $location.path('/login');
                }
                if ($location.path() === '/login' && $rootScope.globals.currentUser) {
                    $location.path('/');
                }
            });
        }
    ]);
