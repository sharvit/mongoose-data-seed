var mongoose = require('mongoose');

var mongoURL = process.env.MONGO_URL || 'mongodb://localhost:27017/dbname';

module.exports = {
  /**
   * Seeders List
   * order is important
   * @type {Object}
   */
  seedersList: {

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
  }
};
