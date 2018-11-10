import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const postSchema = new Schema(
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
      get: tags => tags.join(','),
      set: tags => tags.split(','),
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
  addComment({ author: { _id: author }, body }) {
    this.comments.push({
      author,
      body,
    });

    return this.save();
  },
};

/**
 * Statics
 */

postSchema.statics = {
  load(_id) {
    return this.findOne({ _id })
      .populate('author')
      .populate('comments.author')
      .exec();
  },

  list({ criteria = {}, page = 0, limit = 30 }) {
    return this.find(criteria)
      .populate('author')
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(limit * page)
      .exec();
  },
};

export default mongoose.model('Post', postSchema);
