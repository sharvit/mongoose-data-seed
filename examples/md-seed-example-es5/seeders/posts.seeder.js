var faker = require('faker/locale/en_US');

var Seeder = require('../../../').Seeder;

var User = require('../server/models').User;
var Post = require('../server/models').Post;

var TAGS = ['tag1', 'tag2', 'tag3', 'tag4', 'tag5'];

var PostsSeeder = Seeder.extend({
  beforeRun: function() {
    var _this = this;

    return User.find({})
      .exec()
      .then(function(users) {
        _this.users = users;
        _this.postsData = _this._generatePosts();
      });
  },
  shouldRun: function() {
    return Post.count()
      .exec()
      .then(count => count === 0);
  },
  run: function() {
    return Post.create(this.postsData);
  },
  _generatePosts: function() {
    var posts = [];

    for (var i = 0; i < 10; i++) {
      var post = {
        author: faker.random.arrayElement(this.users),
        title: faker.lorem.words(),
        body: faker.lorem.paragraphs(),
      };

      const randomTagsCount = faker.random.number({
        min: 0,
        max: 5,
        precision: 1,
      });

      for (var j = 0; j < randomTagsCount; j++) {
        post.tags = faker.random.arrayElement(TAGS);
      }

      posts.push(post);
    }

    return posts;
  },
});

module.exports = PostsSeeder;
