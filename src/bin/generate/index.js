import path from 'path';
import memFs from 'mem-fs';
import editor from 'mem-fs-editor';
import chalk from 'chalk';
import logSymbols from 'log-symbols';
import _ from 'lodash';

import { mustContainUserConfig } from '../../lib/utils'
import getOptions from './options';
import usageGuide from './usageGuide';
import config from '../../lib/config';

export default function () {
  mustContainUserConfig();

  const { seederName, helpWanted } = getOptions(process.argv);

  if (helpWanted) {
    console.log(usageGuide);
  } else {
    if ((typeof seederName !== 'string') || (_.trim(seederName).length < 3)) {
      console.log(`${logSymbols.error} Please choose a seeder name.`);
      console.log();
      console.log(usageGuide);
      return process.exit(1);
    }

    generateSeeder(seederName);
  }
}

function generateSeeder(name) {
  const { projectRoot, userSeedersFolderPath } = config;

  const seederName = _.upperFirst(_.camelCase(name));
  const seederFileName = `${seederName}.seeder.js`;
  const seederFilePath = path.join(userSeedersFolderPath, seederFileName);
  const seederFileRelativePath = seederFilePath.replace(`${projectRoot}/`, '');
  const templatePath = path.join(__dirname, '../../../templates/seeder.js');

  const store = memFs.create();
  const fs = editor.create(store);

  if (fs.exists(seederFilePath)) {
    console.log(`${logSymbols.error} ${seederFileRelativePath} are already exists.`);
    return process.exit(0);
  }

  fs.copyTpl(templatePath, seederFilePath, { seederName });

  fs.commit(() => {
    console.log(`${chalk.green('CREATED')} ${seederFileRelativePath}`);
  });
}

