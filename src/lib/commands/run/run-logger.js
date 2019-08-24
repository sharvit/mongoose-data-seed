import chalk from 'chalk';
import logSymbols from 'log-symbols';
import { Spinner } from 'clui';

import BaseLogger from '../../utils/base-logger';
import { MdSeedRunner } from '../../core';

/**
 * Run Logger
 */
export default class RunLogger extends BaseLogger {
  constructor() {
    super();

    this.spinner = new Spinner();
  }

  /**
   * Log next notification
   * @param  {Object} notification notification to log
   * @param  {string} notification.type    operation type
   * @param  {Object} notification.payload operation payload
   */
  next({ type, payload }) {
    this.spinner.stop();

    switch (type) {
      case MdSeedRunner.operations.MONGOOSE_CONNECT_START:
        this.spinner.message('Trying to connect to MongoDB...');
        this.spinner.start();
        break;
      case MdSeedRunner.operations.MONGOOSE_CONNECT_SUCCESS:
        console.log(`${logSymbols.success} Successfully connected to MongoDB!`);
        break;
      case MdSeedRunner.operations.MONGOOSE_DROP_START:
        this.spinner.message('Droping database...');
        this.spinner.start();
        break;
      case MdSeedRunner.operations.MONGOOSE_DROP_SUCCESS:
        console.log(`${logSymbols.success} Database dropped!`);
        break;
      case MdSeedRunner.operations.ALL_SEEDERS_START:
        console.log();
        console.log(`${chalk.cyan('Seeding Results:')}`);
        break;
      case MdSeedRunner.operations.ALL_SEEDERS_FINISH:
        console.log();
        console.log(`${logSymbols.success} Done.`);
        break;
      case MdSeedRunner.operations.SEEDER_START:
        this.spinner.message(payload.name);
        this.spinner.start();
        break;
      case MdSeedRunner.operations.SEEDER_SUCCESS:
        if (payload.results && payload.results.run) {
          console.log(
            `${logSymbols.success} ${payload.name}: ${chalk.gray(
              payload.results.created
            )}`
          );
        } else {
          console.log(`${chalk.gray('-')} ${payload.name}: ${chalk.gray(0)}`);
        }
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
    this.spinner.stop();

    switch (type) {
      case MdSeedRunner.operations.MONGOOSE_CONNECT_ERROR:
        console.log(`${logSymbols.error} Unable to connected to MongoDB!`);
        break;
      case MdSeedRunner.operations.MONGOOSE_DROP_ERROR:
        console.log(`${logSymbols.error} Unable to drop database!`);
        break;
      case MdSeedRunner.operations.SEEDER_ERROR:
        console.log(`${logSymbols.error} ${payload.name}`);
        break;
    }

    if (payload && payload.error) console.error(payload.error);
  }
}
