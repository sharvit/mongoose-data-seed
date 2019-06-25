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
  seederTemplate: 'file-path.js',
};

test.beforeEach('mock imports', t => {
  const mocks = {
    optionDefinitions: 'some option definitions',
    commandLineArgs: sinon.stub(),
    validateSeedersFolderName: sinon.stub(),
    validateSeederTemplatePath: sinon.stub(),
    promptSeedersFolder: sinon.stub(),
    promptSeederTemplate: sinon.stub(),
  };

  t.context = { mocks };

  for (const [name, mock] of Object.entries(mocks)) {
    moduleRewireAPI.__Rewire__(name, mock);
  }
});

test.afterEach.always('unmock imports', t => {
  for (const name of Object.keys(t.context.mocks)) {
    moduleRewireAPI.__ResetDependency__(name);
  }
});

test('should get user options from the cli', t => {
  const { argv, seedersFolder, seederTemplate } = helpData;

  const { commandLineArgs, optionDefinitions } = t.context.mocks;

  commandLineArgs
    .withArgs(optionDefinitions, { argv })
    .returns({ seedersFolder, seederTemplate, help: false });

  const expectedOptions = {
    seedersFolder,
    customSeederTemplate: seederTemplate,
    helpWanted: false,
  };
  const recivedOptions = getOptions(argv);

  t.true(commandLineArgs.calledWith(optionDefinitions, { argv }));
  t.deepEqual(recivedOptions, expectedOptions);
});

test.serial(
  'promptMissingOptions should not prompt when suplying valid options',
  async t => {
    const { seedersFolder, seederTemplate } = helpData;
    const options = { seedersFolder, customSeederTemplate: seederTemplate };

    const {
      validateSeedersFolderName,
      validateSeederTemplatePath,
      promptSeedersFolder,
      promptSeederTemplate,
    } = t.context.mocks;

    validateSeedersFolderName.withArgs(seedersFolder).returns(true);
    validateSeederTemplatePath.withArgs(seederTemplate).returns(true);

    const results = await promptMissingOptions(options);

    t.deepEqual(results, options);
    t.true(validateSeedersFolderName.calledWith(seedersFolder));
    t.true(validateSeederTemplatePath.calledWith(seederTemplate));
    t.false(promptSeedersFolder.called);
    t.false(promptSeederTemplate.called);
  }
);

test.serial(
  'promptMissingOptions should prompt all when not supplying options',
  async t => {
    const { seedersFolder, seederTemplate } = helpData;
    const expectedResults = {
      seedersFolder,
      customSeederTemplate: seederTemplate,
    };

    const {
      validateSeedersFolderName,
      validateSeederTemplatePath,
      promptSeedersFolder,
      promptSeederTemplate,
    } = t.context.mocks;

    validateSeedersFolderName.returns(false);
    validateSeederTemplatePath.returns(false);
    promptSeedersFolder.returns(seedersFolder);
    promptSeederTemplate.returns(seederTemplate);

    const results = await promptMissingOptions();

    t.deepEqual(results, expectedResults);
    t.true(validateSeedersFolderName.called);
    t.true(validateSeederTemplatePath.called);
    t.true(promptSeedersFolder.called);
    t.true(promptSeederTemplate.called);
  }
);
