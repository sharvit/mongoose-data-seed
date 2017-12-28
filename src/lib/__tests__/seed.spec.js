import test from 'ava';
import sinon from 'sinon';

import { default as seed, __RewireAPI__ as seedModuleRewireAPI } from '../seed'; // eslint-disable-line import/named

test.beforeEach(t => {
  t.context.mustContainUserConfig = sinon.spy();
  t.context.runSeeders = sinon.spy();
  t.context.seedersList = {
    Seeder1: {},
    Seeder2: {},
    Seeder3: {},
  };

  seedModuleRewireAPI.__Rewire__('config', {
    userConfigExists: true,
    userConfig: { seedersList: t.context.seedersList },
  });
  seedModuleRewireAPI.__Rewire__(
    'mustContainUserConfig',
    t.context.mustContainUserConfig
  );
  seedModuleRewireAPI.__Rewire__('runSeeders', t.context.runSeeders);
});

test.afterEach(t => {
  seedModuleRewireAPI.__ResetDependency__('config');
  seedModuleRewireAPI.__ResetDependency__('mustContainUserConfig');
  seedModuleRewireAPI.__ResetDependency__('runSeeders');

  delete t.context.seedersList;
  delete t.context.mustContainUserConfig;
  delete t.context.runSeeders;
});

test('should call runSeeders func with the selected available seeders', t => {
  seed(['seeder1', 'seeder3', 'seeder4']);

  const runningSeeders = t.context.runSeeders.getCall(0).args[0];

  t.true(t.context.mustContainUserConfig.calledOnce);
  t.deepEqual(Object.keys(runningSeeders), ['Seeder1', 'Seeder3']);
});

test('should call runSeeders func with all seeders', t => {
  seed();

  const runningSeeders = t.context.runSeeders.getCall(0).args[0];

  t.true(t.context.mustContainUserConfig.calledOnce);
  t.deepEqual(Object.keys(runningSeeders), ['Seeder1', 'Seeder2', 'Seeder3']);
});
