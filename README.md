[![Package Version](https://img.shields.io/npm/v/mongoose-data-seed.svg?style=flat-square)](https://www.npmjs.com/package/mongoose-data-seed)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![Downloads Status](https://img.shields.io/npm/dm/mongoose-data-seed.svg?style=flat-square)](https://npm-stat.com/charts.html?package=mongoose-data-seed&from=2016-04-01)
[![Build Status: Linux](https://img.shields.io/travis/sharvit/mongoose-data-seed/master.svg?style=flat-square)](https://travis-ci.org/sharvit/mongoose-data-seed)
[![Coverage Status](https://coveralls.io/repos/github/sharvit/mongoose-data-seed/badge.svg?branch=master)](https://coveralls.io/github/sharvit/mongoose-data-seed?branch=master)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)
[![dependencies Status](https://david-dm.org/sharvit/mongoose-data-seed/status.svg)](https://david-dm.org/sharvit/mongoose-data-seed)
[![devDependencies Status](https://david-dm.org/sharvit/mongoose-data-seed/dev-status.svg)](https://david-dm.org/sharvit/mongoose-data-seed?type=dev)
[![Greenkeeper badge](https://badges.greenkeeper.io/sharvit/mongoose-data-seed.svg)](https://greenkeeper.io/)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fsharvit%2Fmongoose-data-seed.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2Fsharvit%2Fmongoose-data-seed?ref=badge_shield)
[![MIT License](https://img.shields.io/npm/l/stack-overflow-copy-paste.svg?style=flat-square)](http://opensource.org/licenses/MIT)

# mongoose-data-seed

Seed mongodb with data using mongoose models

![cli example using md-seed run](https://raw.githubusercontent.com/sharvit/mongoose-data-seed/master/md-seed-run-example.gif)

## Install

```shell
npm install --save mongoose-data-seed
md-seed init
```

`md-seed init` will ask you to choose a folder for your seeders.

`md-seed init` will create the `seeders` folder, generate `md-seed-config.js` and update your `package.json`.

## Use

Generate seeder file

```shell
md-seed g users
```

Run all seeders

```shell
md-seed run
```

Or run specific seeders

```shell
md-seed run users posts comments
```

## Options

Drop the database before seeding

```shell
md-seed run --dropdb
```

## Seeder Example

```javascript
import { Seeder } from 'mongoose-data-seed';
import { User } from '../server/models';

const data = [
  {
    email: 'user1@gmail.com',
    password: '123123',
    passwordConfirmation: '123123',
    isAdmin: true
  },
  {
    email: 'user2@gmail.com',
    password: '123123',
    passwordConfirmation: '123123',
    isAdmin: false
  }
];

class UsersSeeder extends Seeder {
  async shouldRun() {
    return User.countDocuments()
      .exec()
      .then(count => count === 0);
  }

  async run() {
    return User.create(data);
  }
}

export default UsersSeeder;

```

### md-seed-config.js

`md-seed` expecting to get 3 values from `md-seed-config.js`

1. `seedersList` - A key/value list of all your seeders,
   `md-seed` will run your seeders as they ordered in the list.
1. `connect` - Connect to mongodb implementation (should return promise).
2. `dropdb` - Drop/Clear the database implementation (should return promise).

#### Example

```javascript
import mongoose from 'mongoose';

import Users from './seeders/users.seeder';
import Posts from './seeders/posts.seeder';
import Comments from './seeders/comments.seeder';

const mongoURL = process.env.MONGO_URL || 'mongodb://localhost:27017/dbname';

/**
 * Seeders List
 * order is important
 * @type {Object}
 */
export const seedersList = {
  Users,
  Posts,
  Comments,
};
/**
 * Connect to mongodb implementation
 * @return {Promise}
 */
export const connect = async () => await mongoose.connect(mongoURL, { useNewUrlParser: true });
/**
 * Drop/Clear the database implementation
 * @return {Promise}
 */
export const dropdb = async () => mongoose.connection.db.dropDatabase();

```

### Configurations

`mongoose-data-seed` configurations will get loaded from the `mdSeed` field in your `package.json` file.

Field                  | Default Value | Description
-----------------------|---------------|--------------------------------------------------------------------------
`seedersFolder`        | `'./seeders'` | Path for your seeders-folder, seeders will be generated into this folder.
`customSeederTemplate` | `undefined`   | Path to a custom template file to generate your seeders from.


## Examples

1. [md-seed-example](https://github.com/sharvit/mongoose-data-seed/tree/master/examples/md-seed-example)

## License

MIT

[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fsharvit%2Fmongoose-data-seed.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2Fsharvit%2Fmongoose-data-seed?ref=badge_shield)
[![MIT License](https://img.shields.io/npm/l/stack-overflow-copy-paste.svg?style=flat-square)](http://opensource.org/licenses/MIT)
