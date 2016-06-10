'use strict';

/**
 * @ngdoc function
 * @name fptdriveApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the fptdriveApp
 */
angular.module('fptdriveApp')
    .controller('MonitoringCtrl', [
        '$scope',
        '$location',
        '$anchorScroll',
        '$interval',
        'uiGmapGoogleMapApi',
        'SocketFactory',
        'DeviceFactory',
        'BusFactory',
        '$http',
        function($scope, $location, $anchorScroll,$interval, uiGmapGoogleMapApi, SocketFactory, DeviceFactory, BusFactory, $http) {
        this.awesomeThings = [
            'HTML5 Boilerplate',
            'AngularJS',
            'Karma'
        ];

        $scope.options = {
            draggable: false,
            scrollwheel: false
        };

        $http.get("/api/bus").then( 

            function(res){
                console.log(res);
                $scope.busDictionary = res.data;
                var budSelectedID = BusFactory.getSelectedBusID();
                $scope.selectedBusID = $scope.busDictionary[budSelectedID];
            }, 
            function(err){
                return err;
                console.log(err);
            }
        );

        var _marker = {
            id: 0,
            coords: {
                latitude: 0,
                longitude: 0
            },
            options: {
                draggable: false,
                icon: {
                    url: '/images/bus.png',
                    scaledSize: {
                        width: 25,
                        height: 25
                    }
                }
            },

        };

        $scope.marker = _marker;

        $scope.map = {
            center: $scope.marker.coords,
            zoom: 16
        };
        
        $scope.chartOptions = {
            scaleShowGridLines: true,
            bezierCurve: false,
            animation: false,
            // Boolean - Whether the scale should stick to integers, not floats even if drawing space is there
            scaleOverride: true,
            scaleSteps: 10,
            scaleStepWidth: 4,
            scaleStartValue: 0,
            scaleIntegersOnly: false
        };
        $scope.passengerChartOptions = {
            scaleShowVerticalLines: true,
            scaleShowHorizontalLines: false,
            bezierCurve: false,
            animation: false,
            // Boolean - Whether the scale should stick to integers, not floats even if drawing space is there
            scaleOverride: true,
            scaleSteps: 10,
            scaleStepWidth: 1,
            scaleStartValue: 0,
            scaleIntegersOnly: false
        };
        $scope.fuelChartOptions = {
            scaleShowGridLines: true,
            bezierCurve: false,
            animation: false,
            // Boolean - Whether the scale should stick to integers, not floats even if drawing space is there
            scaleOverride: true,
            scaleSteps: 10,
            scaleStepWidth: 6,
            scaleStartValue: 0,
            scaleIntegersOnly: false
        };

        $scope.humidChartOptions = {
            scaleShowGridLines: true,
            bezierCurve: false,
            animation: false,
            // Boolean - Whether the scale should stick to integers, not floats even if drawing space is there
            scaleOverride: true,
            scaleSteps: 10,
            scaleStepWidth: 10,
            scaleStartValue: 0,
            scaleIntegersOnly: false
        };

        $scope.distanceChartOptions = {
            scaleShowGridLines: true,
            bezierCurve: false,
            animation: false,
            // Boolean - Whether the scale should stick to integers, not floats even if drawing space is there
            scaleOverride: true,
            scaleSteps: 10,
            scaleStepWidth: 6,
            scaleStartValue: 0
        };


        $scope.timelabel = ['', '', '', '', '', '', '', '', '', ''];
        $scope.pasengerData = [
            [5, 4, 5, 4, 3, 2, 1, 0, 5, 1],
            [5, 2, 3, 5, 2, 5, 1, 0, 3, 2]
        ];
        $scope.temperatureData = [
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        ];

        $scope.fuelData = [
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            // [51, 51, 51, 50, 50, 50, 49, 49, 48, 48]
        ];

        $scope.humidData = [
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            // [51, 51, 51, 50, 50, 50, 49, 49, 48, 48]
        ];

        $scope.distanceData = [
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            // [51, 51, 51, 50, 50, 50, 49, 49, 48, 48]
        ];


        $scope.passengerColours = [
            // '#ff76a5', // red
            '#9dd6d6' // green
        ];
        $scope.fuelColours = [
            '#97bbcd'
        ];
        $scope.humidColours = [
            '#9dd6d6'  
        ];

        $scope.distanceColours = [
            '#ffb6c1'
        ];

        $scope.tempColours = [
            '#ff76a5'
        ];

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
    
        SocketFactory.on('topic/environment', function(msg) {
            msg = msg.replace(/\'/g, '"');

            var data = angular.fromJson(msg);
            
            var busId = DeviceFactory.getBus(data.device_id);
            if( busId == parseInt($scope.selectedBusID.id)){
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

        SocketFactory.on('topic/camera', function(msg) {
            msg = msg.replace(/\'/g, '"');
            var data = angular.fromJson(msg);
            var busId = DeviceFactory.getBus(data.device_id);
            if( busId == parseInt($scope.selectedBusID.id)){
                var distance_to_next = Math.round(data.distance_to_next * 100) / 100;

                $scope.distanceData[0].shift();
                $scope.distanceData[0].push(distance_to_next);
                $scope.distanceNow = distance_to_next;
            }
        });


        SocketFactory.on('topic/gps', function(msg) {
            msg = msg.replace(/\'/g, '"');
            var data = angular.fromJson(msg);
            var busId = DeviceFactory.getBus(data.device_id);
            if( busId == parseInt($scope.selectedBusID.id)){
                var lat = data.latitude;
                var lng = data.longitude;
                _marker.coords.latitude = parseFloat(data.latitude);
                _marker.coords.longitude = parseFloat(data.longitude);
            }
        });
        $scope.doorstate = {};
        $scope.doorstate.timestamp;
        $scope.doorstate.shortstate;
        $scope.doorstate.longstate;

        SocketFactory.on('topic/doorstatus', function(msg) {
            msg = msg.replace(/\'/g, '"');
            var data = angular.fromJson(msg);
            var busId = DeviceFactory.getBus(data.device_id);
            if( busId == parseInt($scope.selectedBusID.id)){
                $scope.doorstate.timestamp = data.timestamp;
                if( data.is_open == 0) {
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

        SocketFactory.on('topic/face', function(msg) {
            msg = msg.replace(/\'/g, '"');
            var data = angular.fromJson(msg);
            var busId = DeviceFactory.getBus(data.device_id);
            if( busId == parseInt($scope.selectedBusID.id)){
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

