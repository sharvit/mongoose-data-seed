import test from 'ava';
import sinon from 'sinon';

import { default as seed, __RewireAPI__ as seedModuleRewireAPI } from '../seed'; // eslint-disable-line import/named

test.beforeEach(t => {
  t.context.mustContainUserConfig = sinon.spy();
  t.context.getObjectWithSelectedKeys = sinon.stub().returns('work');
  t.context.runSeeders = sinon.spy();
  t.context.seedersList = {};

  seedModuleRewireAPI.__Rewire__('config', { userConfig: { seedersList: t.context.seedersList } });
  seedModuleRewireAPI.__Rewire__('mustContainUserConfig', t.context.mustContainUserConfig);
  seedModuleRewireAPI.__Rewire__('getObjectWithSelectedKeys', t.context.getObjectWithSelectedKeys);
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
  seed(['seeder1', 'seeder3']);

  t.true(t.context.mustContainUserConfig.calledOnce);
  t.true(t.context.runSeeders.calledWith('work'));
});
