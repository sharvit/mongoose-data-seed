import { Seeder } from '../../../';
import { User } from '../server/models';

const data = [
  {
    email: 'user1@gmail.com',
    password: '123123',
    passwordConfirmation: '123123',
    isAdmin: true,
  },
  {
    email: 'user2@gmail.com',
    password: '123123',
    passwordConfirmation: '123123',
    isAdmin: false,
  },
  {
    email: 'user3@gmail.com',
    password: '123123',
    passwordConfirmation: '123123',
    isAdmin: false,
  },
  {
    email: 'user4@gmail.com',
    password: '123123',
    passwordConfirmation: '123123',
    isAdmin: false,
  },
  {
    email: 'user5@gmail.com',
    password: '123123',
    passwordConfirmation: '123123',
    isAdmin: false,
  },
];

class UsersSeeder extends Seeder {
  async shouldRun() {
    const count = await User.countDocuments().exec();

    return count === 0;
  }

  async run() {
    return User.create(data);
  }
}

export default UsersSeeder;
