import _ from 'lodash';

import config from './config';
import {
  runSeeders,
  mustContainUserConfig,
  getObjectWithSelectedKeys,
} from './utils';

const seed = selectedSeeders => {
  if (!Array.isArray(selectedSeeders)) {
    selectedSeeders = [];
  }

  mustContainUserConfig();

  const { seedersList } = config.userConfig;

  const seeders =
    selectedSeeders.length > 0
      ? getObjectWithSelectedKeys(
          seedersList,
          selectedSeeders.map(name => _.upperFirst(_.camelCase(name)))
        )
      : seedersList;

  return runSeeders(seeders);
};

export default seed;
