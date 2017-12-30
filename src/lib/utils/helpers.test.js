import test from 'ava';

import {
  getObjectWithSelectedKeys,
  mustContainUserConfig,
  __RewireAPI__ as moduleRewireAPI,
} from './helpers'; // eslint-disable-line import/named

test('should get similar object with the selected keys', t => {
  const testObj = {
    key1: '',
    key2: '',
    key3: '',
  };

  const results = getObjectWithSelectedKeys(testObj, ['key1', 'key3']);
  const expectedResults = { key1: testObj.key1, key3: testObj.key3 };

  t.deepEqual(results, expectedResults);
});

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
