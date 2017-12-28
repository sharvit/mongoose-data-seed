import faker from 'faker/locale/en_US';

import { Seeder } from '../../../';
import { Post, User } from '../server/models';

const TAGS = ['tag1', 'tag2', 'tag3', 'tag4', 'tag5'];

class PostsSeeder extends Seeder {
  async beforeRun() {
    this.users = await User.find({}).exec();
    this.postsData = this._generatePosts();
  }

  async shouldRun() {
    return Post.count()
      .exec()
      .then(count => count === 0);
  }

  async run() {
    return Post.create(this.postsData);
  }

  _generatePosts() {
    return Array.apply(null, Array(10)).map(() => {
      const randomUser = faker.random.arrayElement(this.users);

      const randomTagsCount = faker.random.number({
        min: 0,
        max: 5,
        precision: 1,
      });
      const randomTags = Array.apply(null, Array(randomTagsCount))
        .map(() => faker.random.arrayElement(TAGS))
        .join(',');

      return {
        author: randomUser._id,
        title: faker.lorem.words(),
        body: faker.lorem.paragraphs(),
        tags: randomTags,
      };
    });
  }
}

export default PostsSeeder;
