import config from '../../config';
import { MdSeedRunner } from '../../core';
import { validateUserConfig } from '../../utils/helpers';

import RunLogger from './run-logger';

/**
 * Run seeders
 * @param  {Object}   [options={}]          Options
 * @param  {string[]} [options.selectedSeeders=[]]  Selected seeders to run.
 *                                                  When empty, run all seeders.
 * @param  {boolean}   [options.dropDatabase=false] Drop database before running?
 * @return {Promise}
 */
const run = async ({ selectedSeeders = [], dropDatabase = false } = {}) => {
  validateUserConfig();

  // get relevant user-config
  const { connect, dropdb, seedersList } = config.loadUserConfig();

  // create logger
  const logger = new RunLogger();

  // create runner
  const runner = new MdSeedRunner({ connect, dropdb, seedersList });

  // run seeders
  const observable = runner.run({ selectedSeeders, dropDatabase });

  // subscribe logger
  observable.subscribe(logger.asObserver());

  // wait for runner
  await observable.toPromise();
};

export default run;
