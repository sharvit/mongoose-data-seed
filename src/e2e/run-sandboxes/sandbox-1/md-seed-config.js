import mongoose from 'mongoose';

import Seeder1 from './seeders/seeder-1.seeder';
import Seeder2 from './seeders/seeder-2.seeder';
import Seeder3 from './seeders/seeder-3.seeder';

const mongoURL =
  process.env.MONGO_URL || 'mongodb://localhost:27017/md-seed-run-sandbox-1';

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

let db;
/**
 * Connect to mongodb implementation
 * @return {Promise}
 */
export const connect = async () =>
  (db = await mongoose.connect(mongoURL, { useNewUrlParser: true }));
/**
 * Drop/Clear the database implementation
 * @return {Promise}
 */
export const dropdb = async () => {
  await mongoose.connection.db.dropDatabase();
  await db.disconnect();
};
