import _fs from 'fs';
import path from 'path';
import memFs from 'mem-fs';
import editor from 'mem-fs-editor';
import chalk from 'chalk';
import inquirer from 'inquirer';
import _ from 'lodash';

import config from '../../lib/config';

import { getOptions } from './options';
import usageGuide from './usage-guide';

export default function(argv) {
  let { es6, seedersFolder, helpWanted } = getOptions(argv);

  if (helpWanted) {
    console.log(usageGuide);
  } else {
    return (
      Promise.resolve()
        // Ask the user wheter to use es2015 syntax if not decided yet
        .then(() => {
          if (typeof es6 !== 'boolean') {
            return inquirer
              .prompt([
                {
                  name: 'useES6',
                  type: 'confirm',
                  message:
                    'Would you like to use ES6/ES2015 syntax? (require babel)',
                  default: true,
                },
              ])
              .then(({ useES6 }) => {
                es6 = useES6 === true;
              });
          }
        })
        // Ask the user wheter for the seeders folder name if not decided yet
        .then(() => {
          if (
            typeof seedersFolder !== 'string' ||
            _.trim(seedersFolder).length < 3
          ) {
            return inquirer
              .prompt([
                {
                  name: 'seedersFolderName',
                  type: 'input',
                  message: 'Choose your seeders folder name',
                  default: 'seeders',
                  filter: input => _.trim(input),
                  validate: input => input.length >= 3,
                },
              ])
              .then(({ seedersFolderName }) => {
                seedersFolder = seedersFolderName;
              });
          }
        })
        .then(() => {
          return init({ es6, seedersFolder });
        })
    );
  }
}

function init({ es6 = false, seedersFolder = 'seeders' }) {
  const store = memFs.create();
  const fs = editor.create(store);

  _writeUserGeneratorConfig();
  _writeUserConfig();
  _createSeedersFolder();

  function _writeUserGeneratorConfig() {
    const {
      projectRoot,
      userGeneratorConfigExists,
      userGeneratorConfigFilename,
      userGeneratorConfigFilepath,
    } = config;

    const generatorConfig = { es6, seedersFolder };

    if (userGeneratorConfigExists === true) {
      return console.log(
        `${chalk.yellow(
          'CONFLICT'
        )} ${userGeneratorConfigFilename} are already exists`
      );
    }

    fs.writeJSON(userGeneratorConfigFilepath, generatorConfig);

    config.useEs6Generator = generatorConfig.es6;
    config.userSeedersFolderName = generatorConfig.seedersFolder;
    config.userSeedersFolderPath = path.join(
      projectRoot,
      generatorConfig.seedersFolder
    );

    fs.commit(() => {
      console.log(`${chalk.green('CREATED')} ${userGeneratorConfigFilename}`);
    });
  }

  function _createSeedersFolder() {
    const { userSeedersFolderName, userSeedersFolderPath } = config;

    if (_fs.existsSync(userSeedersFolderPath)) {
      return console.log(
        `${chalk.yellow(
          'CONFLICT'
        )} ${userSeedersFolderName}/ are already exists`
      );
    }

    try {
      _fs.mkdirSync(userSeedersFolderPath);
      console.log(`${chalk.green('CREATED')} ${userSeedersFolderName}/`);
    } catch (err) {
      console.log(
        `${chalk.red(
          'ERROR'
        )} ${userSeedersFolderName}/ unable to create folder`
      );
      return console.log(err.stack);
    }
  }

  function _writeUserConfig() {
    const {
      userConfigExists,
      userConfigFilename,
      userConfigFilepath,
      useEs6Generator,
    } = config;
    const templatePath = useEs6Generator
      ? path.join(__dirname, '../../../templates/md-seed-config.es6.js')
      : path.join(__dirname, '../../../templates/md-seed-config.js');

    if (userConfigExists === true) {
      return console.log(
        `${chalk.yellow('CONFLICT')} ${userConfigFilename} are already exists`
      );
    }

    fs.copy(templatePath, userConfigFilepath);
    fs.commit(() => {
      console.log(`${chalk.green('CREATED')} ${userConfigFilename}`);
    });
  }
}
