module.exports = function (orm, db) {
  var Bus = db.define("bus", {
      id:             {type: 'serial', key: true}, // the auto-incrementing primary key
      bus_id:         {type: 'text'},
      manufacturer:   {type: 'text'},
      description:    {type: 'text'},
      release_date:     {type: 'text'},
      last_maintenance_date: {type: 'text'},
  },
    {

      methods: {

        serialize: function () {
          var drivers;
          if (this.drivers) {
            drivers = this.drivers.map(function (c) { return c.serialize(); });
          } else {
            drivers = [];
          }

          var routeinfos;
          if (this.routeinfos) {
            routeinfos = this.routeinfos.map(function (c) { return c.serialize(); });
          } else {
            routeinfos = [];
          }

          var devices;
          if (this.devices) {
            devices = this.devices.map(function (c) { return c.serialize(); });
          } else {
            devices = [];
          }

          return {
            id : this.id,
            bus_id: this.bus_id,
            manufacturer: this.manufacturer,
            description: this.description,
            release_date: this.release_date,
            last_maintenance_date: this.last_maintenance_date,
            drivers: drivers,
            routeinfos: routeinfos,
            devices: devices
          }
        }
      }
    });

  Bus.hasMany('drivers', db.models.driver, { why: String }, { reverse: 'buses', key: true, autoFetch: true });
  Bus.hasMany('routeinfos', db.models.routeinfo, { why: String }, { reverse: 'buses', key: true, autoFetch: true });
  //Bus.hasMany('devices', db.models.device, { why: String }, { key: true });
};