var Seeder = require('mongoose-data-seed').Seeder;
var Model = require('../server/models');

var data = [{

}];

var <%= seederName %>Seeder = Seeder.extend({
  shouldRun: function () {
    return Model.count().exec().then(count => count === 0);
  },
  run: function () {
    return Model.create(data);
  }
});

module.exports = <%= seederName %>Seeder;
