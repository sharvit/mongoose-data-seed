import inquirer from 'inquirer';
import { trim } from 'lodash';

import { validateSeedersFolderName } from '../../utils';

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
