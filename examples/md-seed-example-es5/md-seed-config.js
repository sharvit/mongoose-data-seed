var mongoose = require('mongoose');

var config = require('./server/config');

var UsersSeeder = require('./seeders/users.seeder');
var PostsSeeder = require('./seeders/posts.seeder');
var CommentsSeeder = require('./seeders/comments.seeder');

module.exports = {
  // connect to mongodb
  connect: function() {
    return mongoose.connect(config.mongoURL);
  },

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
