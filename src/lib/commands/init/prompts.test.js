import test from 'ava';
import sinon from 'sinon';

import {
  promptUseBabel,
  promptSeedersFolder,
  __RewireAPI__ as moduleRewireAPI,
} from './prompts';

const helpData = {
  argv: 'some argv',
  seedersFolder: 'folder-name',
  optionDefinitions: 'some option definitions',
};

test.beforeEach('mock imports', t => {
  const mocks = {
    inquirer: { prompt: sinon.stub() },
    validateSeedersFolderName: sinon.stub(),
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

test('should prompt to use babel', async t => {
  const { inquirer } = t.context.mocks;

  inquirer.prompt.resolves({ useBabel: true });

  const result = await promptUseBabel();

  t.true(result);
});

test('should prompt to enter seeders-folder-name', async t => {
  const seedersFolderName = 'some-folder-name';
  const { inquirer, validateSeedersFolderName } = t.context.mocks;

  const fakedPrompt = async optionsArray => {
    const promptResults = {};

    for (const { name, validate, filter } of optionsArray) {
      const value = filter(seedersFolderName);

      if (!validate(value)) throw new Error(`${name} is invalid`);

      promptResults[name] = value;
    }

    return promptResults;
  };

  inquirer.prompt.callsFake(fakedPrompt);
  validateSeedersFolderName.withArgs(seedersFolderName).returns(true);

  const result = await promptSeedersFolder();

  t.is(result, seedersFolderName);
  t.true(validateSeedersFolderName.calledWith(seedersFolderName));
});
