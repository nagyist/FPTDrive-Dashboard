module.exports = function (orm, db) {
  var RouteInfo = db.define("routeinfo", {
      id:               {type: 'serial', key: true}, // the auto-incrementing primary key
      route_id:         {type: 'text'},
      polyline:         {type: 'text'},
      start_point:      {type: 'text'},
      end_point:        {type: 'text'}
  },
    {
      methods: {
        serialize: function () {
          var buses;
          if (this.buses) {
            buses = this.buses.map(function (c) { return c.serialize(); });
          } else {
            buses = [];
          }
          return {
            id : this.id,
            route_id: this.route_id,
            polyline: this.polyline,
            start_point: this.start_point,
            end_point: this.end_point,
            buses: buses
          };
        }
      }
    });
  //RouteInfo.hasMany('buses', db.models.bus, { why: String }, { reverse: 'routeinfos', key: true });
};
