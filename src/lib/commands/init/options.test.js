import test from 'ava';
import sinon from 'sinon';

import {
  getOptions,
  promptMissingOptions,
  __RewireAPI__ as moduleRewireAPI,
} from './options';

const helpData = {
  argv: 'some argv',
  seedersFolder: 'folder-name',
};

test.beforeEach('mock imports', t => {
  const mocks = {
    optionDefinitions: 'some option definitions',
    commandLineArgs: sinon.stub(),
    validateSeedersFolderName: sinon.stub(),
    promptUseBabel: sinon.stub(),
    promptSeedersFolder: sinon.stub(),
  };

  t.context = { mocks };

  for (const [name, mock] of Object.entries(mocks)) {
    moduleRewireAPI.__Rewire__(name, mock);
  }
});

test.afterEach('unmock imports', t => {
  for (const name of Object.keys(t.context.mocks)) {
    moduleRewireAPI.__ResetDependency__(name);
  }
});

test('should get user options from the cli', t => {
  const { argv, seedersFolder } = helpData;

  const { commandLineArgs, optionDefinitions } = t.context.mocks;

  commandLineArgs
    .withArgs(optionDefinitions, { argv })
    .returns({ seedersFolder, help: false, es6: true });

  const expectedOptions = { seedersFolder, helpWanted: false, babel: true };
  const recivedOptions = getOptions(argv);

  t.true(commandLineArgs.calledWith(optionDefinitions, { argv }));
  t.deepEqual(recivedOptions, expectedOptions);
});

test('promptMissingOptions should not prompt when suplying valid options', async t => {
  const options = { babel: true, seedersFolder: 'folder-name' };

  const {
    validateSeedersFolderName,
    promptUseBabel,
    promptSeedersFolder,
  } = t.context.mocks;

  validateSeedersFolderName.withArgs(options.seedersFolder).returns(true);

  const results = await promptMissingOptions(options);

  t.deepEqual(results, options);
  t.true(validateSeedersFolderName.calledWith(options.seedersFolder));
  t.false(promptUseBabel.called);
  t.false(promptSeedersFolder.called);
});

test('promptMissingOptions should prompt all when not supplying options', async t => {
  const expectedResults = { babel: true, seedersFolder: 'folder-name' };

  const {
    validateSeedersFolderName,
    promptUseBabel,
    promptSeedersFolder,
  } = t.context.mocks;

  validateSeedersFolderName.returns(false);
  promptUseBabel.returns(expectedResults.babel);
  promptSeedersFolder.returns(expectedResults.seedersFolder);

  const results = await promptMissingOptions();

  t.deepEqual(results, expectedResults);
  t.true(validateSeedersFolderName.called);
  t.true(promptUseBabel.called);
  t.true(promptSeedersFolder.called);
});
