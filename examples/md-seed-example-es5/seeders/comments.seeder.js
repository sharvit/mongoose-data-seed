var faker = require('faker/locale/en_US');

var Seeder = require('../../../').Seeder;

var User = require('../server/models').User;
var Post = require('../server/models').Post;

var CommentsSeeder = Seeder.extend({
  beforeRun: function() {
    var _this = this;

    return Promise.resolve()
      .then(function() {
        return _this._loadUsers();
      })
      .then(function() {
        return _this._loadPosts();
      });
  },
  shouldRun: function() {
    return Post.count({ comments: { $gt: 0 } })
      .exec()
      .then(count => count === 0);
  },
  run: function() {
    var results = [];

    for (var postsIndex = 0; postsIndex < this.posts.length; postsIndex++) {
      var post = this.posts[postsIndex];

      var comments = this._generateCommentList();

      for (
        var commentsIndex = 0;
        commentsIndex < comments.length;
        commentsIndex++
      ) {
        var comment = comments[commentsIndex];

        const result = post.addComment(comment);

        results.push(result);
      }
    }

    return Promise.all(results);
  },
  _loadUsers: function() {
    var _this = this;

    return User.find({})
      .exec()
      .then(function(users) {
        _this.users = users;
      });
  },
  _loadPosts: function() {
    var _this = this;

    return Post.find({})
      .exec()
      .then(function(posts) {
        _this.posts = posts;
      });
  },
  _generateCommentList: function() {
    var comments = [];

    var randomCommentsCount = faker.random.number({
      min: 0,
      max: 10,
      precision: 1,
    });

    for (var i = 0; i < randomCommentsCount; i++) {
      comments.push(this._generateCommentItem());
    }

    return comments;
  },
  _generateCommentItem: function() {
    return {
      author: faker.random.arrayElement(this.users),
      body: faker.lorem.sentence(),
    };
  },
});

module.exports = CommentsSeeder;
