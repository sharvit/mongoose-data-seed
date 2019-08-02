import mongoose from 'mongoose';

import Users from './seeders/users.seeder';
import Posts from './seeders/posts.seeder';
import Comments from './seeders/comments.seeder';

const mongoURL = process.env.MONGO_URL || 'mongodb://localhost:27017/dbname';

/**
 * Seeders List
 * order is important
 * @type {Object}
 */
export const seedersList = {
  Users,
  Posts,
  Comments,
};
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
