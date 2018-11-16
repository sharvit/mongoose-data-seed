import commandLineArgs from 'command-line-args';

import {
  validateSeedersFolderName,
  validateSeederTemplatePath,
} from '../../utils/helpers';
import { promptSeedersFolder, promptSeederTemplate } from './prompts';
import optionDefinitions from './option-definitions';

export const getOptions = argv => {
  const {
    seedersFolder,
    seederTemplate: customSeederTemplate,
    help: helpWanted,
  } = commandLineArgs(optionDefinitions, { argv });

  return { seedersFolder, customSeederTemplate, helpWanted };
};

export const promptMissingOptions = async ({
  seedersFolder,
  customSeederTemplate,
} = {}) => {
  const getSeedersFolder = async () =>
    validateSeedersFolderName(seedersFolder)
      ? seedersFolder
      : await promptSeedersFolder();

  const getCustomSeederTemplate = async () =>
    validateSeederTemplatePath(customSeederTemplate)
      ? customSeederTemplate
      : await promptSeederTemplate();

  return {
    seedersFolder: await getSeedersFolder(),
    customSeederTemplate: await getCustomSeederTemplate(),
  };
};
