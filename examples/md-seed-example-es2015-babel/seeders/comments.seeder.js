import faker from 'faker/locale/en_US';

import { Seeder } from '../../../';
import { User, Post } from '../server/models';

class CommentsSeeder extends Seeder {
  async beforeRun() {
    this.users = await User.find({}).exec();
    this.posts = await Post.find({}).exec();
  }

  async shouldRun() {
    return Post.count({ comments: { $exists: false } })
      .exec()
      .then(count => count === 0);
  }

  async run() {
    const results = [];

    for (const post of this.posts) {
      const comments = this._generateCommentList();

      for (const comment of comments) {
        const result = await post.addComment(comment);

        results.push(result);
      }
    }

    return results;
  }

  _generateCommentList() {
    const randomCommentsCount = faker.random.number({
      min: 0,
      max: 10,
      precision: 1,
    });

    return Array.apply(null, Array(randomCommentsCount)).map(() =>
      this._generateCommentItem()
    );
  }

  _generateCommentItem() {
    const author = faker.random.arrayElement(this.users);
    const body = faker.lorem.sentence();

    return {
      author,
      body,
    };
  }
}

export default CommentsSeeder;
