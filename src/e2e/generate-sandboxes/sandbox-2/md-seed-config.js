import mongoose from 'mongoose';

const mongoURL =
  process.env.MONGO_URL ||
  'mongodb://localhost:27017/md-seed-generate-sandbox-1';

/**
 * Seeders List
 * order is important
 * @type {Object}
 */
export const seedersList = {};
/**
 * Connect to mongodb implementation
 * @return {Promise}
 */
export const connect = async () =>
  mongoose.connect(mongoURL, { useNewUrlParser: true });
/**
 * Drop/Clear the database implementation
 * @return {Promise}
 */
export const dropdb = async () => mongoose.connection.db.dropDatabase();
