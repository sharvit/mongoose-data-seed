var mongooseLib = require('mongoose');

var Seeder1Seeder = require('./seeders/seeder-1.seeder');
var Seeder2Seeder = require('./seeders/seeder-2.seeder');
var Seeder3Seeder = require('./seeders/seeder-3.seeder');

mongooseLib.Promise = global.Promise || Promise;

module.exports = {
  // Export the mongoose lib
  mongoose: mongooseLib,

  // Export the mongodb url
  mongoURL:
    process.env.MONGO_URL ||
    'mongodb://localhost:27017/md-seed-run-sandbox-es5',

  /*
    Seeders List
    ------
    order is important
  */
  seedersList: {
    Seeder1: Seeder1Seeder,
    Seeder2: Seeder2Seeder,
    Seeder3: Seeder3Seeder,
  },
};
