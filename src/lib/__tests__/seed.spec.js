import test from 'ava';
import sinon from 'sinon';

import { default as seed, __RewireAPI__ as seedModuleRewireAPI } from '../seed'; // eslint-disable-line import/named

test.beforeEach(t => {
  t.context.seedersList = {
    Seeder1: {},
    Seeder2: {},
    Seeder3: {},
  };
  seedModuleRewireAPI.__Rewire__('config', {
    userConfigExists: true,
    userConfig: { seedersList: t.context.seedersList },
  });
});

test.afterEach(t => {
  seedModuleRewireAPI.__ResetDependency__('config');
  delete t.context.seedersList;
});

test('should call runSeeders func with the selected available seeders', t => {
  const mustContainUserConfig = sinon.spy();
  const runSeeders = sinon.spy();
  seedModuleRewireAPI.__Rewire__(
    'mustContainUserConfig',
    mustContainUserConfig
  );
  seedModuleRewireAPI.__Rewire__('runSeeders', runSeeders);
  seed(['seeder1', 'seeder3', 'seeder4']);
  t.true(runSeeders.calledOnce);
  t.true(mustContainUserConfig.calledOnce);

  const runningSeeders = runSeeders.getCall(0).args[0];
  t.deepEqual(Object.keys(runningSeeders), ['Seeder1', 'Seeder3']);
  seedModuleRewireAPI.__ResetDependency__('mustContainUserConfig');
  seedModuleRewireAPI.__ResetDependency__('runSeeders');
});

test('should call runSeeders func with all seeders', t => {
  const mustContainUserConfig = sinon.spy();
  const runSeeders = sinon.spy();
  seedModuleRewireAPI.__Rewire__(
    'mustContainUserConfig',
    mustContainUserConfig
  );
  seedModuleRewireAPI.__Rewire__('runSeeders', runSeeders);
  seed();
  t.true(runSeeders.calledOnce);
  t.true(mustContainUserConfig.calledOnce);

  const runningSeeders = runSeeders.getCall(0).args[0];
  t.deepEqual(Object.keys(runningSeeders), ['Seeder1', 'Seeder2', 'Seeder3']);
  seedModuleRewireAPI.__ResetDependency__('mustContainUserConfig');
  seedModuleRewireAPI.__ResetDependency__('runSeeders');
});
