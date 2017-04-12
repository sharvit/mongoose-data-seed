const mongooseLib = require('mongoose');
mongooseLib.Promise = global.Promise || Promise;

module.exports = {

  // export the mongoose lib
  mongoose: mongooseLib,

  // export the mongodb url
  mongoURL: process.env.MONGO_URL || 'mongodb://localhost:27017/dbname',

  /*
    Seeders List
    ------
    order is important
  */
  seedersList: {

  }
};
