import test from 'ava';
import sinon from 'sinon';

import generate, { __RewireAPI__ as moduleRewireAPI } from './index';

const helpData = { argv: 'some argv', seederName: 'some-seeder-name' };

test.beforeEach('create stubs', t => {
  const stubs = {
    getOptions: sinon.stub(),
    help: sinon.stub(),
    generateSeeder: sinon.stub(),
  };

  Object.keys(stubs).forEach(methodName =>
    moduleRewireAPI.__Rewire__(methodName, stubs[methodName])
  );

  t.context = { stubs };
});

test.afterEach.always('restore stubs', t => {
  const { stubs } = t.context;

  Object.keys(stubs).forEach(methodName =>
    moduleRewireAPI.__ResetDependency__(methodName)
  );
});

test.serial('should show help when asking for help', async t => {
  const { argv } = helpData;
  const { getOptions, help, generateSeeder } = t.context.stubs;

  getOptions.withArgs(argv).returns({ helpWanted: true });

  await generate(argv);

  t.true(getOptions.calledWith(argv));
  t.true(help.called);
  t.false(generateSeeder.called);
});

test.serial('should generate seeder when asking with seeder-name', async t => {
  const { argv, seederName } = helpData;
  const { getOptions, help, generateSeeder } = t.context.stubs;

  getOptions.withArgs(argv).returns({ seederName });

  await generate(argv);

  t.true(getOptions.calledWith(argv));
  t.false(help.called);
  t.true(generateSeeder.calledWith(seederName));
});
