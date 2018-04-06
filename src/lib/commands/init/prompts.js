import inquirer from 'inquirer';
import { trim } from 'lodash';

import { validateSeedersFolderName } from '../../utils';

export const promptUseBabel = async () => {
  const { useBabel } = await inquirer.prompt([
    {
      name: 'useBabel',
      type: 'confirm',
      message: 'Would you like to use babel?',
      default: true,
    },
  ]);

  return useBabel;
};

export const promptSeedersFolder = async () => {
  const { seedersFolderName } = await inquirer.prompt([
    {
      name: 'seedersFolderName',
      type: 'input',
      message: 'Choose your seeders folder name',
      default: 'seeders',
      filter: input => trim(input),
      validate: input => validateSeedersFolderName(input),
    },
  ]);

  return seedersFolderName;
};
