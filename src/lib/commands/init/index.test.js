import test from 'ava';
import sinon from 'sinon';

import init, { __RewireAPI__ as moduleRewireAPI } from './index';

test.beforeEach('mock imports', t => {
  const mocks = {
    getOptions: sinon.stub(),
    help: sinon.stub(),
    runInstaller: sinon.stub(),
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

test.serial('should show help', async t => {
  const { getOptions, help, runInstaller } = t.context.mocks;

  const argv = 'some-argv';

  getOptions.withArgs(argv).returns({ helpWanted: true });

  await init(argv);

  t.true(getOptions.calledWith(argv));
  t.true(help.called);
  t.false(runInstaller.called);
});

test.serial('should run installer', async t => {
  const { getOptions, help, runInstaller } = t.context.mocks;

  const argv = 'some-argv';
  const options = { some: 'options' };

  getOptions.withArgs(argv).returns(options);

  await init(argv);

  t.true(getOptions.calledWith(argv));
  t.false(help.called);
  t.true(runInstaller.calledWith(options));
});
