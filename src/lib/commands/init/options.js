import commandLineArgs from 'command-line-args';

import { validateSeedersFolderName } from '../../utils/helpers';
import { promptUseBabel, promptSeedersFolder } from './prompts';
import optionDefinitions from './option-definitions';

export const getOptions = argv => {
  const { seedersFolder, help: helpWanted } = commandLineArgs(
    optionDefinitions,
    { argv }
  );

  return { seedersFolder, helpWanted };
};

export const promptMissingOptions = async ({ seedersFolder } = {}) => {
  const isSeedersFolderValid = validateSeedersFolderName(seedersFolder);

  return {
    seedersFolder: isSeedersFolderValid
      ? seedersFolder
      : await promptSeedersFolder(),
  };
};
