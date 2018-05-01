var Seeder = require('../../../src/lib').Seeder;

var Seeder1Seeder = Seeder.extend({
  beforeRun: function() {
    console.log('Seeder1Seeder::beforeRun');
    return Promise.resolve();
  },
  shouldRun: function() {
    console.log('Seeder1Seeder::shouldRun');
    return Promise.resolve();
  },
  run: function() {
    console.log('Seeder1Seeder::run');
    return Promise.resolve();
  },
});

module.exports = Seeder1Seeder;
