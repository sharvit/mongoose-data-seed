var mongooseLib = require('mongoose');

var config = require('./server/config');

var UsersSeeder = require('./seeders/users.seeder');
var PostsSeeder = require('./seeders/posts.seeder');
var CommentsSeeder = require('./seeders/comments.seeder');

mongooseLib.Promise = global.Promise || Promise;

module.exports = {
  // Export the mongoose lib
  mongoose: mongooseLib,

  // Export the mongodb url
  mongoURL: config.mongoURL,

  /*
    Seeders List
    ------
    order is important
  */
  seedersList: {
    Users: UsersSeeder,
    Posts: PostsSeeder,
    Comments: CommentsSeeder,
  },
};
