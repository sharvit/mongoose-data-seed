import test from 'ava';
import sinon from 'sinon';
import { Observable } from 'rxjs/Observable';

import { mockImports, resetImports } from '../../utils/test-helpers';

import MdSeedRunner from '../../core/__mocks__/md-seed-runner';
import RunLogger from './__mocks__/run-logger';

import run, { __RewireAPI__ as moduleRewireAPI } from './run';

const userConfig = {
  mongoose: 'some-mongoose',
  mongoURL: 'some-url',
  seedersList: 'some-seeders-list',
};

const config = {
  loadUserConfig: () => userConfig,
};

test.beforeEach('mock imports', t => {
  const mocks = {
    config,
    MdSeedRunner,
    RunLogger,
    validateUserConfig: sinon.stub(),
  };

  t.context = { mocks };

  mockImports({ moduleRewireAPI, mocks });
});

test.afterEach('unmock imports', t => {
  const imports = Object.keys(t.context.mocks);

  resetImports({ moduleRewireAPI, imports });
});

test('Should run', async t => {
  const { validateUserConfig, MdSeedRunner, RunLogger } = t.context.mocks;

  await run();

  t.true(validateUserConfig.called);

  t.true(MdSeedRunner.calledWith(userConfig));
  t.true(
    MdSeedRunner.prototype.run.calledWith({
      selectedSeeders: [],
      dropDatabase: false,
    })
  );
  t.true(
    MdSeedRunner.stubbedOvservable.subscribe.calledWith(
      RunLogger.stubbedOvserver
    )
  );
  t.true(MdSeedRunner.stubbedOvservable.toPromise.called);

  t.true(RunLogger.called);
  t.true(RunLogger.prototype.asObserver.called);
});

test('Should run with args', async t => {
  const { validateUserConfig, MdSeedRunner, RunLogger } = t.context.mocks;

  const selectedSeeders = ['some', 'seeders'];
  const dropDatabase = true;

  await run({ selectedSeeders, dropDatabase });

  t.true(validateUserConfig.called);

  t.true(MdSeedRunner.calledWith(userConfig));
  t.true(
    MdSeedRunner.prototype.run.calledWith({
      selectedSeeders,
      dropDatabase,
    })
  );
  t.true(
    MdSeedRunner.stubbedOvservable.subscribe.calledWith(
      RunLogger.stubbedOvserver
    )
  );
  t.true(MdSeedRunner.stubbedOvservable.toPromise.called);

  t.true(RunLogger.called);
  t.true(RunLogger.prototype.asObserver.called);
});
