var orm      = require('orm');

var settings = {
  database   : {
    protocol : "mysql",
    query    : { pool: true },
    host     : "33.33.34.10",
    port     : 3306,
    database : "fptdrive",
    user     : "root",
    password : "root"
  }
};

var connection = null;

function setup(db, cb) {
  require('./device')(orm, db);
  require('./driver')(orm, db);
  require('./routeinfo')(orm, db);
  require('./bus')(orm, db);
  return cb(null, db);
}

module.exports = function (cb) {
  //console.log("Connected DB");
  if (connection) return cb(null, connection);
  orm.connect(settings.database, function (err, db) {
    if (err) return cb(err);

    connection = db;
    db.settings.set('instance.returnAllErrors', true);
    setup(db, cb);
  });
};
