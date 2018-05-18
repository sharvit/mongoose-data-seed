import 'babel-register';
import 'babel-polyfill';

import chalk from 'chalk';
import logSymbols from 'log-symbols';
import { Spinner } from 'clui';

import { mustContainUserConfig } from '../../lib/utils';
import config from '../../lib/config';
import seed from '../../lib/seed';
import { getOptions } from './options';
import usageGuide from './usage-guide';

export default function(argv) {
  mustContainUserConfig();

  const { mongoose, mongoURL } = config.userConfig;
  const { selectedSeeders, dropDatabase, helpWanted } = getOptions(argv);

  if (helpWanted) {
    console.log(usageGuide);
    return Promise.resolve();
  }

  return run({
    mongoose,
    mongoURL,
    selectedSeeders,
    dropDatabase,
  });
}

function connectToMongoose(mongoose, mongoURL, callback) {
  const mongooseMajorVersion = mongoose.version.split('.')[0];

  if (mongooseMajorVersion === '4') {
    return mongoose.connect(mongoURL, { useMongoClient: true }, callback);
  }

  return mongoose.connect(mongoURL, callback);
}

function run({ mongoose, mongoURL, selectedSeeders, dropDatabase }) {
  const spinner = new Spinner(`Trying to connect to MongoDB: ${mongoURL}`);
  spinner.start();

  return new Promise((resolve, reject) => {
    // MongoDB Connection
    connectToMongoose(mongoose, mongoURL, error => {
      spinner.stop();

      if (error) {
        return reject(
          new Error(
            `${logSymbols.error} Unable to connected to MongoDB: ${chalk.gray(
              mongoURL
            )}`
          )
        );
      }

      console.log(
        `${logSymbols.success} Successfully connected to MongoDB: ${chalk.gray(
          mongoURL
        )}`
      );

      if (dropDatabase === true) {
        spinner.message(`Droping database...`);
        spinner.start();

        mongoose.connection.db.dropDatabase();

        spinner.stop();
        console.log(`${logSymbols.success} Database dropped!`);
      }

      console.log();
      console.log(`${chalk.cyan('Seeding Results:')}`);

      seed(selectedSeeders).subscribe({
        next: ({ name, results }) => {
          spinner.stop();

          if (results) {
            const { run, created } = results;

            if (run) {
              console.log(
                `${logSymbols.success} ${name}: ${chalk.gray(created)}`
              );
            } else {
              console.log(`${logSymbols.error} ${name}`);
            }
          } else {
            spinner.message(name);
            spinner.start();
          }
        },
        error: ({ name, error }) => {
          spinner.stop();

          console.log(`${logSymbols.error} ${name}`);
          console.log();
          console.log(chalk.red('ERROR'));
          console.log(error.stack);

          reject(error);
        },
        complete: () => resolve(),
      });
    });
  });
}
