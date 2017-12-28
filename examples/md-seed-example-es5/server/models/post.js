var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var postSchema = new Schema(
  {
    author: {
      type: Schema.ObjectId,
      ref: 'User',
      index: true,
      required: 'Post author cannot be blank',
    },

    title: {
      type: String,
      trim: true,
      required: 'Post title cannot be blank',
    },

    body: {
      type: String,
      trim: true,
      required: 'Post body cannot be blank',
    },

    comments: [
      {
        author: {
          type: Schema.ObjectId,
          ref: 'User',
          required: 'Comment author cannot be blank',
        },
        body: {
          type: String,
          trim: true,
          required: 'Post body cannot be blank',
        },
        createdAt: { type: Date, default: Date.now },
      },
    ],

    tags: {
      type: [],
      get: function(tags) {
        return tags.join(',');
      },
      set: function(tags) {
        return tags.split(',');
      },
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Methods
 */
postSchema.methods = {
  addComment: function(comment) {
    this.comments.push({
      author: comment.author._id,
      body: comment.body,
    });

    return this.save();
  },
};

/**
 * Statics
 */

postSchema.statics = {
  load: function(_id) {
    return this.findOne({ _id: _id })
      .populate('author')
      .populate('comments.author')
      .exec();
  },

  list: function(options = {}) {
    var criteria = options.criteria || {};
    var page = options.page || 0;
    var limit = options.limit || 30;

    return this.find(criteria)
      .populate('author')
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(limit * page)
      .exec();
  },
};

module.exports = mongoose.model('Post', postSchema);
