import inquirer from 'inquirer';
import { trim } from 'lodash';

import {
  validateSeedersFolderName,
  validateSeederTemplatePath,
} from '../../utils/helpers';

/**
 * @private
 */
export const promptSeedersFolder = async () => {
  const { seedersFolderName } = await inquirer.prompt([
    {
      name: 'seedersFolderName',
      type: 'input',
      message: 'Choose your seeders folder name',
      default: './seeders',
      filter: input => trim(input),
      validate: input => validateSeedersFolderName(input),
    },
  ]);

  return seedersFolderName;
};

/**
 * @private
 */
export const promptSeederTemplate = async () => {
  const { useCustomSeeder } = await inquirer.prompt([
    {
      name: 'useCustomSeeder',
      type: 'confirm',
      message:
        'Would you like to use your own custom template for your seeders?',
      default: false,
    },
  ]);

  if (!useCustomSeeder) {
    return;
  }

  const { seederTemplatePath } = await inquirer.prompt([
    {
      name: 'seederTemplatePath',
      type: 'input',
      message: 'Choose a path for your seeder template',
      default: './md-seed-template.ejs',
      filter: input => trim(input),
      validate: input => validateSeederTemplatePath(input),
    },
  ]);

  return seederTemplatePath;
};
