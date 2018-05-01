var Seeder = require('../../../src/lib').Seeder;

var Seeder3Seeder = Seeder.extend({
  beforeRun: function() {
    console.log('Seeder3Seeder::beforeRun');
    return Promise.resolve();
  },
  shouldRun: function() {
    console.log('Seeder3Seeder::shouldRun');
    return Promise.resolve();
  },
  run: function() {
    console.log('Seeder3Seeder::run');
    return Promise.resolve();
  },
});

module.exports = Seeder3Seeder;
