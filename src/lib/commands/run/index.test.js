import test from 'ava';
import sinon from 'sinon';

import { mockImports, resetImports } from '../../utils/test-helpers';

import command, { __RewireAPI__ as moduleRewireAPI } from './index';

test.beforeEach('mock imports', t => {
  const mocks = {
    getOptions: sinon.stub(),
    help: sinon.stub(),
    run: sinon.stub(),
  };

  t.context = { mocks };

  mockImports({ moduleRewireAPI, mocks });
});

test.afterEach.always('unmock imports', t => {
  const imports = Object.keys(t.context.mocks);

  resetImports({ moduleRewireAPI, imports });
});

test.serial('should show help', async t => {
  const { getOptions, help, run } = t.context.mocks;

  const argv = 'some-argv';

  getOptions.withArgs(argv).returns({ helpWanted: true });

  await command(argv);

  t.true(getOptions.calledWith(argv));
  t.true(help.called);
  t.false(run.called);
});

test.serial('should run installer', async t => {
  const { getOptions, help, run } = t.context.mocks;

  const argv = 'some-argv';
  const options = { some: 'options' };

  getOptions.withArgs(argv).returns(options);

  await command(argv);

  t.true(getOptions.calledWith(argv));
  t.false(help.called);
  t.true(run.calledWith(options));
});
