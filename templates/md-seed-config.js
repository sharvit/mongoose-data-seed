import mongooseLib from 'mongoose';
mongooseLib.Promise = global.Promise;

// export the mongoose lib
export const mongoose = mongooseLib;

// export the mongodb url
export const mongoURL = process.env.MONGO_URL || 'mongodb://localhost:27017/dbname';

/*
  Seeders List
  ------
  order is important
*/
export const seedersList = {

};
