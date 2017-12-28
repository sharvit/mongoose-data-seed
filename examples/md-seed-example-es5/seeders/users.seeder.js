var Seeder = require('../../../').Seeder;
var User = require('../server/models').User;

var data = [
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

var UsersSeeder = Seeder.extend({
  shouldRun: function() {
    return User.count()
      .exec()
      .then(count => count === 0);
  },
  run: function() {
    return User.create(data);
  },
});

module.exports = UsersSeeder;
