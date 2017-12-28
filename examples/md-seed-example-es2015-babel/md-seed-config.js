import mongooseLib from 'mongoose';

import config from './server/config';

import Users from './seeders/users.seeder';
import Posts from './seeders/posts.seeder';
import Comments from './seeders/comments.seeder';

mongooseLib.Promise = global.Promise;

// Export the mongoose lib
export const mongoose = mongooseLib;

// Export the mongodb url
export const mongoURL = config.mongoURL;

/*
  Seeders List
  ------
  order is important
*/
export const seedersList = {
  Users,
  Posts,
  Comments,
};
