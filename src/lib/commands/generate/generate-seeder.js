import chalk from 'chalk';

import { SeederGenerator } from '../../core';
import { validateUserConfig } from '../../utils';
import { seederTemplate, userSeedersFolderPath } from '../../config';

const generateSeeder = async name => {
  validateUserConfig();

  const generator = new SeederGenerator({
    name,
    seederTemplate,
    userSeedersFolderPath,
  });

  const generatedSeederFile = await generator.generate();

  console.log(`${chalk.green('CREATED')} ${generatedSeederFile}`);
};

export default generateSeeder;
