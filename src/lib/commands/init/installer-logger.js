import chalk from 'chalk';

import BaseLogger from '../../utils/base-logger';
import { Installer } from '../../core';

/**
 * Installer Logger
 */
export default class InstallerLogger extends BaseLogger {
  /**
   * Log next notification
   * @param  {Object} notification notification to log
   * @param  {string} notification.type    operation type
   * @param  {Object} notification.payload operation payload
   */
  next({ type, payload }) {
    switch (type) {
      case Installer.operations.WRITE_USER_GENERETOR_CONFIG_SUCCESS:
        console.log(`${chalk.green('UPDATED')} package.json`);
        break;

      case Installer.operations
        .CREATE_CUSTOM_SEEDER_TEMPLATE_FILE_SKIP_FILE_EXISTS:
        console.log(
          `${chalk.yellow('SKIP')} ${
            payload.customSeederTemplateFilename
          } are already exists`
        );
        break;
      case Installer.operations.CREATE_CUSTOM_SEEDER_TEMPLATE_FILE_SUCCESS:
        console.log(
          `${chalk.green('CREATED')} ${payload.customSeederTemplateFilename}`
        );
        break;

      case Installer.operations.CREATE_SEEDERS_FOLDER_SKIP_FOLDER_EXISTS:
        console.log(
          `${chalk.yellow('SKIP')} ${payload.foldername} are already exists`
        );
        break;
      case Installer.operations.CREATE_SEEDERS_FOLDER_SUCCESS:
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

  /**
   * Log error
   * @param  {Object} error         error to log
   * @param  {string} error.type    error type
   * @param  {Object} error.payload error payload
   */
  error({ type, payload }) {
    switch (type) {
      case Installer.operations.WRITE_USER_GENERETOR_CONFIG_ERROR:
        console.log(
          `${chalk.red('ERROR')} Unable to write config file: ${chalk.gray(
            payload.filepath
          )}`
        );
        break;

      case Installer.operations.CREATE_CUSTOM_SEEDER_TEMPLATE_FILE_ERROR:
        console.log(
          `${chalk.red(
            'ERROR'
          )} Unable to create custom seeder template: ${chalk.gray(
            payload.customSeederTemplatePath
          )}`
        );
        break;

      case Installer.operations.CREATE_SEEDERS_FOLDER_ERROR:
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
