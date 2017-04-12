import 'babel-register';
import 'babel-polyfill';

import path from 'path';
import findRoot from 'find-root';
import console from 'better-console';

import { mustContainUserConfig } from '../../lib/utils'
import getOptions from './options';
import usageGuide from './usageGuide';
import config from '../../lib/config';
import seed from '../../lib/seed';

export default function () {
  mustContainUserConfig();

  const { mongoose, mongoURL } = config.userConfig;
  const { selectedSeeders, dropDatabase, helpWanted } = getOptions(process.argv);

  if (helpWanted) {
    console.log(usageGuide);
  } else {
    run({
      mongoose,
      mongoURL,
      selectedSeeders,
      dropDatabase
    });
  }
}

function run({ mongoose, mongoURL, selectedSeeders, dropDatabase }) {
  console.log('Trying to connect to MongoDB: ', mongoURL);
  console.log();

  // MongoDB Connection
  mongoose.connect(mongoURL, (error) => {
    if (error) {
      console.warn('Please make sure Mongodb is installed and running!');
      throw error;
    }

    console.warn('Successfully connected to MongoDB!');
    console.log();

    if (dropDatabase === true) {
      mongoose.connection.db.dropDatabase();

      console.warn('Database dropped!');
      console.log();
    }

    seed(selectedSeeders)
      .then(
        response => displayResponse(response),
        error => displayError(error)
      )
      .then(() => process.exit())
    ;
  });
};

function displayResponse(response) {
  const tableResponse = {};

  let i = 0;
  for (let r in response) {
    tableResponse[i] = Object.assign({ name: r }, response[r])

    ++i;
  }

  console.log('Done.');
  console.log('');
  console.table(tableResponse);
};

function displayError(error) {
  console.error(error);
};
