var express   = require('express');
var http = require('http');
var path = require('path');
var routes = require('./routes');
var awsIot = require('aws-iot-device-sdk');
var app = express();
var models   = require('./model/');
var staticData = 1565;

app.set('port', 80);	
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());

// app.use(function (req, res, next) {
//   models(function (err, db) {
//     if (err) return next(err);

//     req.models = db.models;
//     req.db     = db;

//     return next();
//   });
// }),

app.use(app.router);
app.use(express.static(path.join(__dirname, '..', 'app')));

app.get('/api/data/getFuelData', function(req, res) {
  
  res.json(staticData);

});



// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/test', routes.index);

app.get('/', function(req,res) {
	res.sendfile('./app/index.html');
});

var server = http.createServer(app);
var io = require('socket.io').listen(server);

io.on('connection', function (socket) {
   socket.emit('notification', 'socket ready');
});

app.get('/api/assets', function(req, res) {


  res.json(sensordata);
  
});

app.get('/api/drivers', function(req, res) {
  req.models.driver.all(function (err, driverRS) {
    if (err) res.send(500); else {
     res.json(driverRS.map(function (c) { return c.serialize(); }));
    }
  });
});

app.get('/api/drivers/:driver_id', function(req, res) {
  req.models.driver.get(req.params.driver_id, function (err, driverRS) {
    if (err) res.send(500); else {
     res.json(driverRS.serialize());
    }
  });
});

app.get('/api/bus', function(req, res) {

  res.json(busData);

});

app.get('/api/bus/:busId', function(req, res) {
  req.models.bus.get(req.params.busId, function (err, busRS) {
    if (err) res.send(500); else {
     res.json(busRS.serialize());
    }
  });
});

///
var device = awsIot.device({
   keyPath: './certs/9e09675250-private.pem.key',
  certPath: './certs/9e09675250-certificate.pem.crt',
    caPath: './certs/root-CA.crt',
  clientId: 'FptDriveServer',
    region: 'us-east-1'
});

device.on('connect', function() {
    console.log('connected to AWS Iot Hub');
    device.subscribe('topic/environment');
    device.subscribe('topic/gps');
    device.subscribe('topic/doorstatus');
    device.subscribe('topic/camera');
    device.subscribe('topic/face');
});

device.on('message', function(topic, payload) {
    
    var json = payload.toString('utf8', 0, payload.length - 1);
	
	if (json.lastIndexOf('}') != json.length - 1) {
	    json = json.substring(0, json.lastIndexOf('}') + 1);
	}
	
	console.log('server.onmessage', topic, json);
    io.emit(topic, json);
});




      var a = 10,b =20,c=30,d=40;
       var dataSet = [
      {"legendLabel":"Bus1", "magnitude":a}, 
      {"legendLabel":"Bus2", "magnitude":b}, 
      {"legendLabel":"Bus3", "magnitude":c}, 
      {"legendLabel":"Bus4", "magnitude":d}];

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




server.listen(app.get('port'));


var busData = [
  {
    "id": 1,
    "bus_id": "Bus 01",
    "manufacturer": "Samsung",
    "description": "07/10/2010",
    "release_date": "35-seat bus",
    "last_maintenance_date": "07/10/2015",
    "drivers": [],
    "routeinfos": [],
    "devices": []
  },
  {
    "id": 2,
    "bus_id": "Bus 02",
    "manufacturer": "Samsung",
    "description": "07/10/2011",
    "release_date": "35-seat bus",
    "last_maintenance_date": "04/11/2013",
    "drivers": [],
    "routeinfos": [],
    "devices": []
  },
  {
    "id": 3,
    "bus_id": "Bus 03",
    "manufacturer": "Samsung",
    "description": "07/10/2012",
    "release_date": "35-seat bus",
    "last_maintenance_date": "07/12/2014",
    "drivers": [],
    "routeinfos": [],
    "devices": []
  },
  {
    "id": 4,
    "bus_id": "Bus 04",
    "manufacturer": "Samsung",
    "description": "07/10/2013",
    "release_date": "35-seat bus",
    "last_maintenance_date": "15/10/2015",
    "drivers": [],
    "routeinfos": [],
    "devices": []
  }
];


var sensordata = [
  {
    "id": 1,
    "device_id": "c603d35d-2029-363e-a093-0c76a8a323f7",
    "device_name": "Environment Sensor",
    "device_type": "environment",
    "manufacturer": "Honeywell",
    "description": "Tracking the heat, humidity and more",
    "state": "active",
    "latest_update": "10/03/2012",
    "firmware_version": "v1.0.0",
    "configuration": ""
  },
  {
    "id": 2,
    "device_id": "1e91a099-a339-3d39-b31d-76bead836864",
    "device_name": "Environment Sensor",
    "device_type": "environment",
    "manufacturer": "Honeywell",
    "description": "Tracking the heat, humidity and more",
    "state": "active",
    "latest_update": "10/03/2012",
    "firmware_version": "v1.0.0",
    "configuration": ""
  },
  {
    "id": 3,
    "device_id": "cc487baa-c99d-3935-9316-1efa28cb68ee",
    "device_name": "Environment Sensor",
    "device_type": "environment",
    "manufacturer": "Honeywell",
    "description": "Tracking the heat, humidity and more",
    "state": "active",
    "latest_update": "10/03/2012",
    "firmware_version": "v1.0.0",
    "configuration": ""
  },
  {
    "id": 4,
    "device_id": "90a2c97e-c490-33cb-89ee-049b92794e37",
    "device_name": "Environment Sensor",
    "device_type": "environment",
    "manufacturer": "Honeywell",
    "description": "Tracking the heat, humidity and more",
    "state": "active",
    "latest_update": "10/03/2012",
    "firmware_version": "v1.0.0",
    "configuration": ""
  },
  {
    "id": 5,
    "device_id": "33d1ddff-aeb8-38a1-a00d-3c2cf31bc62e",
    "device_name": "GPS Sensor",
    "device_type": "gps",
    "manufacturer": "Shenzhen Joint Technology Co. Ltd",
    "description": "Tracking the position of product",
    "state": "active",
    "latest_update": "10/03/2012",
    "firmware_version": "v1.2.0",
    "configuration": ""
  },
  {
    "id": 6,
    "device_id": "7cb02aa4-e730-30d2-aa54-4989539067ac",
    "device_name": "GPS Sensor",
    "device_type": "gps",
    "manufacturer": "Shenzhen Joint Technology Co. Ltd",
    "description": "Tracking the position of product",
    "state": "active",
    "latest_update": "10/03/2012",
    "firmware_version": "v1.2.0",
    "configuration": ""
  },
  {
    "id": 7,
    "device_id": "ec87c2cc-ab87-35e1-bfd3-be0ea449fcd5",
    "device_name": "GPS Sensor",
    "device_type": "gps",
    "manufacturer": "Shenzhen Joint Technology Co. Ltd",
    "description": "Tracking the position of product",
    "state": "active",
    "latest_update": "10/03/2012",
    "firmware_version": "v1.2.0",
    "configuration": ""
  },
  {
    "id": 8,
    "device_id": "07885ef8-f62c-3a56-849f-c91b3e5d6be8",
    "device_name": "GPS Sensor",
    "device_type": "gps",
    "manufacturer": "Shenzhen Joint Technology Co. Ltd",
    "description": "Tracking the position of product",
    "state": "active",
    "latest_update": "10/03/2012",
    "firmware_version": "v1.2.0",
    "configuration": ""
  },
  {
    "id": 9,
    "device_id": "6197703c-76d0-3336-86df-861a8fa66f74",
    "device_name": "Doors State sensor",
    "device_type": "door_state",
    "manufacturer": "OnSemi Vietnam",
    "description": "Tracking door state is open or closed",
    "state": "active",
    "latest_update": "10/03/2012",
    "firmware_version": "v1.1.1",
    "configuration": ""
  },
  {
    "id": 10,
    "device_id": "fa8a71fa-dd59-3253-92f4-e6d0c1d342f8",
    "device_name": "Doors State sensor",
    "device_type": "door_state",
    "manufacturer": "OnSemi Vietnam",
    "description": "Tracking door state is open or closed",
    "state": "active",
    "latest_update": "10/03/2012",
    "firmware_version": "v1.1.2",
    "configuration": ""
  },
  {
    "id": 11,
    "device_id": "9e3cb0b6-f71d-3435-90ec-9015bb82e29c",
    "device_name": "Doors State sensor",
    "device_type": "door_state",
    "manufacturer": "OnSemi Vietnam",
    "description": "Tracking door state is open or closed",
    "state": "active",
    "latest_update": "10/03/2012",
    "firmware_version": "v1.1.3",
    "configuration": ""
  },
  {
    "id": 12,
    "device_id": "2fbc801c-1d5f-3f9c-94f0-2452ca005f5c",
    "device_name": "Doors State sensor",
    "device_type": "door_state",
    "manufacturer": "OnSemi Vietnam",
    "description": "Tracking door state is open or closed",
    "state": "active",
    "latest_update": "10/03/2012",
    "firmware_version": "v1.1.4",
    "configuration": ""
  },
  {
    "id": 13,
    "device_id": "339260b3-57d4-352d-a37b-98be4445505b",
    "device_name": "Camera Sensor",
    "device_type": "camera",
    "manufacturer": "Canon",
    "description": "Camera sensor for calculating the distance to next obstacles",
    "state": "active",
    "latest_update": "10/03/2012",
    "firmware_version": "v2.1.0",
    "configuration": ""
  }];
