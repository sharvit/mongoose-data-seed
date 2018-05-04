import chalk from 'chalk';

import { SeederGenerator } from '../../core';
import { validateUserConfig } from '../../utils/helpers';
import config from '../../config';

const generateSeeder = async name => {
  validateUserConfig();

  const { seederTemplate, userSeedersFolderPath } = config;

  const generator = new SeederGenerator({
    name,
    seederTemplate,
    userSeedersFolderPath,
  });

  const generatedSeederFile = await generator.generate();

  console.log(`${chalk.green('CREATED')} ${generatedSeederFile}`);
};

export default generateSeeder;
