import path from 'path';
import memFs from 'mem-fs';
import editor from 'mem-fs-editor';

import config from '../../lib/config';

export default function () {
  const { userConfigFilepath: configPath } = config;
  const templatePath = path.join(__dirname, '../../../templates/md-seed-config.js');

  return init({ configPath, templatePath });
}

function init({ configPath, templatePath }) {
  const store = memFs.create();
  const fs = editor.create(store);

  if (!fs.exists(configPath)) {
    fs.copy(templatePath, configPath);
    fs.commit(() => {
      console.log(`Successfully created ${configPath}`);
    });
  } else {
    console.log(`${configPath} are already exists.`);
  }
}
