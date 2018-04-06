import chalk from 'chalk';

import BaseLogger from '../../utils/base-logger';
import { Installer } from '../../core';

export default class InstallerLogger extends BaseLogger {
  next({ type, payload }) {
    switch (type) {
      case Installer.operations.WRITE_USER_GENERETOR_CONFIG_SKIP_FILE_EXISTS:
        console.log(
          `${chalk.yellow('SKIP')} ${payload.filename} are already exists`
        );
        break;
      case Installer.operations.WRITE_USER_GENERETOR_CONFIG_SUCCESS:
        console.log(`${chalk.green('CREATED')} ${payload.filename}`);
        break;

      case Installer.operations.CREARE_SEEDERS_FOLDER_SKIP_FOLDER_EXISTS:
        console.log(
          `${chalk.yellow('SKIP')} ${payload.foldername} are already exists`
        );
        break;
      case Installer.operations.CREARE_SEEDERS_FOLDER_SUCCESS:
        console.log(`${chalk.green('CREATED')} ${payload.foldername}`);
        break;

      case Installer.operations.WRITE_USER_CONFIG_SKIP_FILE_EXISTS:
        console.log(
          `${chalk.yellow('SKIP')} ${payload.filename} are already exists`
        );
        break;
      case Installer.operations.WRITE_USER_CONFIG_SUCCESS:
        console.log(`${chalk.green('CREATED')} ${payload.filename}`);
        break;
    }
  }

  error({ type, payload }) {
    switch (type) {
      case Installer.operations.WRITE_USER_GENERETOR_CONFIG_ERROR:
        console.log(
          `${chalk.red('ERROR')} Unable to write config file: ${chalk.gray(
            payload.filepath
          )}`
        );
        break;

      case Installer.operations.CREARE_SEEDERS_FOLDER_ERROR:
        console.log(
          `${chalk.red('ERROR')} Unable to create seeders folder: ${chalk.gray(
            payload.folderpath
          )}`
        );
        break;

      case Installer.operations.WRITE_USER_CONFIG_ERROR:
        console.log(
          `${chalk.red('ERROR')} Unable to write user config file: ${chalk.gray(
            payload.filepath
          )}`
        );
        break;
    }

    if (payload && payload.error) console.error(payload.error);
  }
}
