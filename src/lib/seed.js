import config from './config';
import { runSeeders, mustContainUserConfig, getObjectWithSelectedKeys } from './utils';

const seed = (selectedSeeders) => {
  mustContainUserConfig();

  const { seedersList } = config.userConfig;

  const seeders = selectedSeeders.length > 0 ?
    getObjectWithSelectedKeys(seedersList, selectedSeeders) :
    seedersList
  ;

  return runSeeders(seeders);
};

export default seed;
