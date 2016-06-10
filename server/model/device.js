module.exports = function (orm, db) {
  var Device = db.define("device", {
        id:                    {type: 'serial', key: true}, // the auto-incrementing primary key
        device_id:             {type: 'text'},
        device_name:           {type: 'text'},
        device_type:           {type: 'text'},
        manufacturer:          {type: 'text'},
        description:           {type: 'text'},
        state:                 {type: 'text'},
        latest_update:         {type: 'text'},
        firmware_version:      {type: 'text'},
        configuration:         {type: 'text'}
    },
      {
        methods: {
          serialize: function () {
              return {
                id : this.id,
                device_id: this.device_id,
                device_name: this.device_name,
                device_type: this.device_type,
                manufacturer: this.manufacturer,
                description: this.description,
                state: this.state,
                latest_update: this.latest_update,
                firmware_version: this.firmware_version,
                configuration: this.configuration
              };
          }
        }
      });
  Device.hasOne('bus', db.models.bus, { why: String }, { key: true, autoFetch: true });
};