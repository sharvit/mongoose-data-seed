import test from 'ava';
import sinon from 'sinon';

import { ExitCodes } from './constants';
import {
  getFolderNameFromPath,
  getObjectWithSelectedKeys,
  validateSeedersFolderName,
  validateSeederTemplatePath,
  validateUserConfig,
  exit,
  __RewireAPI__ as moduleRewireAPI,
} from './helpers';

test('should get folder name from path', t => {
  t.is(getFolderNameFromPath('some/path/with/folder'), 'folder');
});

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

test('should validate seeders folder name', t => {
  t.true(validateSeedersFolderName('folder-name'));
  t.true(validateSeedersFolderName('sed'));
  t.false(validateSeedersFolderName('se'));
  t.false(validateSeedersFolderName('   se  '));
  t.false(validateSeedersFolderName());
});

test('should validate seeder template path', t => {
  t.true(validateSeederTemplatePath('file-name.js'));
  t.true(validateSeederTemplatePath('sedsed'));
  t.false(validateSeederTemplatePath('abcde'));
  t.false(validateSeederTemplatePath('   abcde  '));
  t.false(validateSeederTemplatePath());
});

test('should not throw error if user config exists', async t => {
  moduleRewireAPI.__Rewire__('config', { userConfigExists: true });

  await t.notThrows(validateUserConfig);

  moduleRewireAPI.__ResetDependency__('config');
});

test('should throw error if user config not exists', async t => {
  moduleRewireAPI.__Rewire__('config', { userConfigExists: false });

  await t.throws(validateUserConfig);

  moduleRewireAPI.__ResetDependency__('config');
});

test('should exit with success code', async t => {
  sinon.stub(process, 'exit');
  sinon.stub(console, 'error');

  exit();

  t.true(process.exit.calledWith(ExitCodes.Success));
  t.false(console.error.called);

  process.exit.restore();
  console.error.restore();
});

test('should exit with error code when passing error', async t => {
  sinon.stub(process, 'exit');
  sinon.stub(console, 'error');

  const error = new Error('some error');

  exit(error);

  t.true(process.exit.calledWith(ExitCodes.Error));
  t.true(console.error.calledWith(error));

  process.exit.restore();
  console.error.restore();
});
