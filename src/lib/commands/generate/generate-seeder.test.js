import test from 'ava';
import sinon from 'sinon';

import {
  default as generateSeeder,
  __RewireAPI__ as moduleRewireAPI,
} from './generate-seeder';

const helpData = {
  name: 'name',
  seederTemplate: 'template',
  userSeedersFolderPath: 'path/to/seeders',
};

test('should generate a seeder', async t => {
  const createStubs = ({
    validateUserConfig,
    SeederGenerator,
    seederTemplate,
    userSeedersFolderPath,
  }) => {
    moduleRewireAPI.__Rewire__('validateUserConfig', validateUserConfig);
    moduleRewireAPI.__Rewire__('SeederGenerator', SeederGenerator);
    moduleRewireAPI.__Rewire__('seederTemplate', seederTemplate);
    moduleRewireAPI.__Rewire__('userSeedersFolderPath', userSeedersFolderPath);
    sinon.stub(console, 'log');
  };
  const restoreStubs = () => {
    moduleRewireAPI.__ResetDependency__('validateUserConfig');
    moduleRewireAPI.__ResetDependency__('SeederGenerator');
    moduleRewireAPI.__ResetDependency__('seederTemplate');
    moduleRewireAPI.__ResetDependency__('userSeedersFolderPath');
    console.log.restore();
  };

  const validateUserConfig = sinon.stub();
  const SeederGenerator = sinon.stub();
  SeederGenerator.prototype.generate = sinon.stub().resolves();
  const { name, seederTemplate, userSeedersFolderPath } = helpData;

  createStubs({
    validateUserConfig,
    SeederGenerator,
    seederTemplate,
    userSeedersFolderPath,
  });

  await generateSeeder(name);

  t.true(validateUserConfig.called);
  t.true(SeederGenerator.calledWith(helpData));
  t.true(SeederGenerator.prototype.generate.called);
  t.true(console.log.called);

  restoreStubs();
});
