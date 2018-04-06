import commandLineArgs from 'command-line-args';
import chalk from 'chalk';
import { trim } from 'lodash';

import help from './help';
import optionDefinitions from './option-definitions';

export const getOptions = argv => {
  const { name: seederName, help: helpWanted } = commandLineArgs(
    optionDefinitions,
    { argv }
  );

  const options = { seederName, helpWanted };

  validateOptions(options);

  return options;
};

export const validateOptions = ({ seederName, helpWanted } = {}) => {
  if (
    !helpWanted &&
    (typeof seederName !== 'string' || trim(seederName).length < 3)
  ) {
    console.log(`${chalk.red('ERROR')} Please choose a seeder name`);
    console.log();
    help();

    throw new Error('exit');
  }
};
