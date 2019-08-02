import test from 'ava';
import sinon from 'sinon';

import { mockImports, resetImports } from '../../utils/test-helpers';

import generateSeeder, {
  __RewireAPI__ as moduleRewireAPI,
} from './generate-seeder';

const helpData = {
  name: 'name',
  seederTemplate: 'template',
  userSeedersFolderPath: 'path/to/seeders',
};

test.beforeEach('mock imports', t => {
  const { seederTemplate, userSeedersFolderPath } = helpData;

  const mocks = {
    validateUserConfig: sinon.stub(),
    SeederGenerator: sinon.stub(),
    config: { seederTemplate, userSeedersFolderPath },
  };

  mocks.SeederGenerator.prototype.generate = sinon
    .stub()
    .resolves('some.seeder.js');

  t.context = { mocks };

  mockImports({ moduleRewireAPI, mocks });

  sinon.stub(console, 'log');
});

test.afterEach.always('unmock imports', t => {
  const imports = Object.keys(t.context.mocks);

  resetImports({ moduleRewireAPI, imports });

  console.log.restore();
});

test('should generate a seeder', async t => {
  const { validateUserConfig, SeederGenerator } = t.context.mocks;
  await generateSeeder(helpData.name);

  t.true(validateUserConfig.called);
  t.true(SeederGenerator.calledWith(helpData));
  t.true(SeederGenerator.prototype.generate.called);
  t.true(console.log.called);
});
