import commandLineArgs from 'command-line-args';

import optionDefinitions from './option-definitions';

export const getOptions = argv => {
  const {
    seeders: selectedSeeders,
    dropdb: dropDatabase,
    help: helpWanted,
  } = commandLineArgs(optionDefinitions, { argv });

  return { selectedSeeders, dropDatabase, helpWanted };
};
