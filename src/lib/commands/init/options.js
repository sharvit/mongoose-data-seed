import commandLineArgs from 'command-line-args';

import { validateSeedersFolderName } from '../../utils';
import { promptUseBabel, promptSeedersFolder } from './prompts';
import optionDefinitions from './option-definitions';

export const getOptions = argv => {
  const { es6, seedersFolder, help: helpWanted } = commandLineArgs(
    optionDefinitions,
    { argv }
  );

  return { babel: es6 === true, seedersFolder, helpWanted };
};

export const promptMissingOptions = async ({ babel, seedersFolder } = {}) => {
  const isBabelValid = typeof babel === 'boolean';
  const isSeedersFolderValid = validateSeedersFolderName(seedersFolder);

  return {
    babel: isBabelValid ? babel : await promptUseBabel(),
    seedersFolder: isSeedersFolderValid
      ? seedersFolder
      : await promptSeedersFolder(),
  };
};
