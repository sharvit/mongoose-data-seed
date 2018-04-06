import config from '../../config';
import { MdSeedRunner } from '../../core';
import { validateUserConfig } from '../../utils';

import RunLogger from './run-logger';

export default async ({ selectedSeeders = [], dropDatabase = false } = {}) => {
  validateUserConfig();

  // get relevant user-config
  const { mongoose, mongoURL, seedersList } = config.userConfig;

  // create logger
  const logger = new RunLogger();

  // create runner
  const runner = new MdSeedRunner({ mongoose, mongoURL, seedersList });

  // run seeders
  const observable = runner.run({ selectedSeeders, dropDatabase });

  // subscribe logger
  observable.subscribe(logger.asObserver());

  // wait for runner
  await observable.toPromise();
};
