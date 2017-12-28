import test from 'ava';

import getObjectWithSelectedKeys from '../get-object-with-selected-keys';

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
