import commandLineArgs from 'command-line-args';
import chalk from 'chalk';
import { trim } from 'lodash';

import help from './help';
import optionDefinitions from './option-definitions';

/**
 * Get generate options from argv
 * @param    {string[]} argv              cli argv
 * @return   {Object}                     run options
 * @property {string}   seederName
 * @property {boolean}  helpWanted
 */
export const getOptions = argv => {
  const { name: seederName, help: helpWanted } = commandLineArgs(
    optionDefinitions,
    { argv }
  );

  const options = { seederName, helpWanted };

  validateOptions(options);

  return options;
};

/**
 * Validate generate command options
 * @param  {Object}  [options={}]       Options
 * @param  {string}  options.seederName seeder name to generate
 * @param  {boolean} options.helpWanted help wanted?
 * @throws {Error} throw error when options are not valid.
 */
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
