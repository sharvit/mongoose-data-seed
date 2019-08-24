import commandLineArgs from 'command-line-args';

import {
  validateSeedersFolderName,
  validateSeederTemplatePath,
} from '../../utils/helpers';
import { promptSeedersFolder, promptSeederTemplate } from './prompts';
import optionDefinitions from './option-definitions';

/**
 * Get init options from argv
 * @param    {string[]} argv              cli argv
 * @return   {Object}                     init options
 * @property {string}   seedersFolder
 * @property {string}   customSeederTemplate
 * @property {boolean}  helpWanted
 */
export const getOptions = argv => {
  const {
    seedersFolder,
    seederTemplate: customSeederTemplate,
    help: helpWanted,
  } = commandLineArgs(optionDefinitions, { argv });

  return { seedersFolder, customSeederTemplate, helpWanted };
};

/**
 * Prompt missing options for init command
 * @param  {Object}  [options={}]                 Init command options
 * @param  {[type]}  options.seedersFolder        seeders folder
 * @param  {[type]}  options.customSeederTemplate custom seeder template
 * @return {Promise} Options without missing
 */
export const promptMissingOptions = async ({
  seedersFolder,
  customSeederTemplate,
} = {}) => {
  const getSeedersFolder = async () =>
    validateSeedersFolderName(seedersFolder)
      ? seedersFolder
      : promptSeedersFolder();

  const getCustomSeederTemplate = async () =>
    validateSeederTemplatePath(customSeederTemplate)
      ? customSeederTemplate
      : promptSeederTemplate();

  return {
    seedersFolder: await getSeedersFolder(),
    customSeederTemplate: await getCustomSeederTemplate(),
  };
};
