import commandLineArgs from 'command-line-args';

import optionDefinitions from './option-definitions';

/**
 * Get run options from argv or prompts
 * @param    {string[]} argv              cli argv
 * @return   {Object}                     run options
 * @property {string[]} selectedSeeders
 * @property {boolean}  dropDatabase
 * @property {boolean}  helpWanted
 */
export const getOptions = argv => {
  const {
    seeders: selectedSeeders,
    dropdb: dropDatabase,
    help: helpWanted,
  } = commandLineArgs(optionDefinitions, { argv });

  return { selectedSeeders, dropDatabase, helpWanted };
};
