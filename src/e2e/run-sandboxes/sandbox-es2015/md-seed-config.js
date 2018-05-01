import mongooseLib from 'mongoose';

import Seeder1 from './seeders/seeder-1.seeder';
import Seeder2 from './seeders/seeder-2.seeder';
import Seeder3 from './seeders/seeder-3.seeder';

mongooseLib.Promise = global.Promise;

// Export the mongoose lib
export const mongoose = mongooseLib;

// Export the mongodb url
export const mongoURL =
  process.env.MONGO_URL ||
  'mongodb://localhost:27017/md-seed-run-sandbox-es2015';

/*
  Seeders List
  ------
  order is important
*/
export const seedersList = {
  Seeder1,
  Seeder2,
  Seeder3,
};
