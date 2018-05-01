var Seeder = require('../../../src/lib').Seeder;

var Seeder2Seeder = Seeder.extend({
  beforeRun: function() {
    console.log('Seeder2Seeder::beforeRun');
    return Promise.resolve();
  },
  shouldRun: function() {
    console.log('Seeder2Seeder::shouldRun');
    return Promise.resolve();
  },
  run: function() {
    console.log('Seeder2Seeder::run');
    return Promise.resolve();
  },
});

module.exports = Seeder2Seeder;
