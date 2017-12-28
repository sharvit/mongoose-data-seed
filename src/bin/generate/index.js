import path from 'path';
import memFs from 'mem-fs';
import editor from 'mem-fs-editor';
import chalk from 'chalk';
import _ from 'lodash';

import config from '../../lib/config';
import { mustContainUserConfig } from '../../lib/utils';
import { getOptions } from './options';
import usageGuide from './usage-guide';

export default function(argv) {
  mustContainUserConfig();

  const { seederName, helpWanted } = getOptions(argv);

  if (helpWanted) {
    console.log(usageGuide);
  } else {
    if (typeof seederName !== 'string' || _.trim(seederName).length < 3) {
      console.log(`${chalk.red('ERROR')} Please choose a seeder name`);
      console.log();
      console.log(usageGuide);

      throw new Error('exit');
    }

    generateSeeder(seederName);
  }
}

function generateSeeder(name) {
  const {
    useEs6Generator,
    userSeedersFolderName,
    userSeedersFolderPath,
  } = config;

  const seederName = _.upperFirst(_.camelCase(name));
  const seederFileName = `${_.kebabCase(name)}.seeder.js`;
  const seederFilePath = path.join(userSeedersFolderPath, seederFileName);
  const seederFileRelativePath = path.join(
    userSeedersFolderName,
    seederFileName
  );
  const templatePath = useEs6Generator
    ? path.join(__dirname, '../../../templates/seeder.es6.js')
    : path.join(__dirname, '../../../templates/seeder.js');

  const store = memFs.create();
  const fs = editor.create(store);

  if (fs.exists(seederFilePath)) {
    console.log(
      `${chalk.red('ERROR')} ${seederFileRelativePath} are already exists`
    );
    throw new Error('exit');
  }

  fs.copyTpl(templatePath, seederFilePath, { seederName });

  fs.commit(() => {
    console.log(`${chalk.green('CREATED')} ${seederFileRelativePath}`);
  });
}
