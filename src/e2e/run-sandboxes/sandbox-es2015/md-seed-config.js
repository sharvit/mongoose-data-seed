import mongoose from 'mongoose';

import Seeder1 from './seeders/seeder-1.seeder';
import Seeder2 from './seeders/seeder-2.seeder';
import Seeder3 from './seeders/seeder-3.seeder';

const mongoURL =
  process.env.MONGO_URL ||
  'mongodb://localhost:27017/md-seed-run-sandbox-es2015';

/**
 * Seeders List
 * order is important
 * @type {Object}
 */
export const seedersList = {
  Seeder1,
  Seeder2,
  Seeder3,
};
/**
 * Connect to mongodb implementation
 * @return {Promise}
 */
export const connect = async () => await mongoose.connect(mongoURL);
/**
 * Drop/Clear the database implementation
 * @return {Promise}
 */
export const dropdb = async () => mongoose.connection.db.dropDatabase();
