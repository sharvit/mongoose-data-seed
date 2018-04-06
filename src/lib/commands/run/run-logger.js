import chalk from 'chalk';
import logSymbols from 'log-symbols';
import { Spinner } from 'clui';

import BaseLogger from '../../utils/base-logger';
import { MdSeedRunner } from '../../core';

export default class RunLogger extends BaseLogger {
  constructor() {
    super();

    this.spinner = new Spinner();
  }

  next({ type, payload }) {
    this.spinner.stop();

    switch (type) {
      case MdSeedRunner.operations.MONGOOSE_CONNECT_START:
        this.spinner.message(
          `Trying to connect to MongoDB: ${payload.mongoURL}`
        );
        this.spinner.start();
        break;
      case MdSeedRunner.operations.MONGOOSE_CONNECT_SUCCESS:
        console.log(
          `${
            logSymbols.success
          } Successfully connected to MongoDB: ${chalk.gray(payload.mongoURL)}`
        );
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
        console.log(
          `${logSymbols.success} ${payload.name}: ${chalk.gray(
            payload.results
          )}`
        );
        break;
    }
  }

  error({ type, payload }) {
    this.spinner.stop();

    switch (type) {
      case MdSeedRunner.operations.MONGOOSE_CONNECT_ERROR:
        console.log(
          `${logSymbols.error} Unable to connected to MongoDB: ${chalk.gray(
            payload.mongoURL
          )}`
        );
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
