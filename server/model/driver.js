module.exports = function (orm, db) {
  var Driver = db.define("driver", {
      id:                             {type: 'serial', key: true}, // the auto-incrementing primary key
      driver_id:                      {type: 'text'},
      driver_name:                    {type: 'text'},
      driver_age:                     {type: 'number'},
      driver_certificate_type:        {type: 'text'},
      driver_certificate_issue_date:  {type: 'text'}
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
              driver_id: this.driver_id,
              driver_name: this.driver_name,
              driver_age: this.driver_age,
              driver_certificate_type: this.driver_certificate_type,
              driver_certificate_issue_date: this.driver_certificate_issue_date,
              buses: buses
            };
        }
      }
    }
  );
  
  //Driver.hasMany('buses', db.models.bus, { why: String }, { reverse: 'drivers', key: true });
};