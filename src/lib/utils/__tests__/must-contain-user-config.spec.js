import test from 'ava';

import {
  default as mustContainUserConfig,
  __RewireAPI__ as moduleRewireAPI,
} from '../must-contain-user-config'; // eslint-disable-line import/named

test.serial('should not throw error if user config exists', async t => {
  moduleRewireAPI.__Rewire__('config', { userConfigExists: true });

  await t.notThrows(mustContainUserConfig);

  moduleRewireAPI.__ResetDependency__('config');
});

test.serial('should throw error if user not config exists', async t => {
  moduleRewireAPI.__Rewire__('config', { userConfigExists: false });

  await t.throws(mustContainUserConfig);

  moduleRewireAPI.__ResetDependency__('config');
});
