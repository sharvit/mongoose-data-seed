import test from 'ava';
import sinon from 'sinon';

import {
  promptSeedersFolder,
  promptSeederTemplate,
  __RewireAPI__ as moduleRewireAPI,
} from './prompts';

test.beforeEach('mock imports', t => {
  const mocks = {
    inquirer: { prompt: sinon.stub() },
    validateSeedersFolderName: sinon.stub(),
    validateSeederTemplatePath: sinon.stub(),
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

test.serial('should prompt to enter seeders-folder-name', async t => {
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

test.serial('should prompt to use custom template and decline', async t => {
  const { inquirer } = t.context.mocks;

  inquirer.prompt.callsFake(async () => ({
    useCustomSeeder: false,
  }));

  const result = await promptSeederTemplate();

  t.is(result, undefined);
});

test.serial(
  'should prompt to use custom template and accept with file path',
  async t => {
    const { inquirer, validateSeederTemplatePath } = t.context.mocks;
    const seederTemplatePath = './some-file-name.js';

    const fakedPrompt = async optionsArray => {
      const { name, validate, filter } = optionsArray[0];

      if (name === 'useCustomSeeder') return { useCustomSeeder: true };

      if (name === 'seederTemplatePath') {
        const value = filter(seederTemplatePath);
        if (!validate(value)) throw new Error(`${name} is invalid`);

        return { seederTemplatePath };
      }
    };

    inquirer.prompt.callsFake(fakedPrompt);
    validateSeederTemplatePath.withArgs(seederTemplatePath).returns(true);

    const result = await promptSeederTemplate();

    t.is(result, seederTemplatePath);
  }
);
