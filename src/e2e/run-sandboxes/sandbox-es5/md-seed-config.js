var mongoose = require('mongoose');

var Seeder1Seeder = require('./seeders/seeder-1.seeder');
var Seeder2Seeder = require('./seeders/seeder-2.seeder');
var Seeder3Seeder = require('./seeders/seeder-3.seeder');

var mongoURL =
  process.env.MONGO_URL || 'mongodb://localhost:27017/md-seed-run-sandbox-es5';

module.exports = {
  /**
   * Seeders List
   * order is important
   * @type {Object}
   */
  seedersList: {
    Seeder1: Seeder1Seeder,
    Seeder2: Seeder2Seeder,
    Seeder3: Seeder3Seeder,
  },
  /**
   * Connect to mongodb implementation
   * @return {Promise}
   */
  connect: function() {
    return mongoose.connect(mongoURL);
  },
  /**
   * Drop/Clear the database implementation
   * @return {Promise}
   */
  dropdb: function() {
    return new Promise(function(resolve, reject) {
      mongoose.connection.db.dropDatabase();
      resolve();
    });
  },
};
