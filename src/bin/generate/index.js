import path from 'path';
import memFs from 'mem-fs';
import editor from 'mem-fs-editor';
import console from 'better-console';
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
    if ((seederName.length < 1) || (typeof seederName[0] !== 'string') || (_.trim(seederName[0]).length < 3)) {
      throw 'Please choose a seeder name';
    }

    generateSeeder(seederName[0]);
  }
}

function generateSeeder(name) {
  const { userSeedersFolderPath } = config;

  const store = memFs.create();
  const fs = editor.create(store);

  const seederName = _.upperFirst(_.camelCase(name));
  const seederFileName = `${seederName}.seeder.js`;
  const seederFilePath = path.join(userSeedersFolderPath, seederFileName);

  const templatePath = path.join(__dirname, '../../../templates/seeder.js');

  fs.copyTpl(templatePath, seederFilePath, { seederName });

  fs.commit(() => {
    console.log(`Successfully generate ${seederFilePath}`);
  });
}

