import test from 'ava';
import sinon from 'sinon';

import {
  getOptions,
  validateOptions,
  __RewireAPI__ as moduleRewireAPI,
} from './options';

const helpData = {
  argv: 'some argv',
  seederName: 'some-seeder-name',
  optionDefinitions: 'some option definitions',
};

test('should get user options from the cli', t => {
  const createStubs = ({ commandLineArgs, optionDefinitions }) => {
    moduleRewireAPI.__Rewire__('commandLineArgs', commandLineArgs);
    moduleRewireAPI.__Rewire__('optionDefinitions', optionDefinitions);
  };
  const restoreStubs = () => {
    moduleRewireAPI.__ResetDependency__('commandLineArgs');
    moduleRewireAPI.__ResetDependency__('optionDefinitions');
  };

  const { argv, optionDefinitions, seederName } = helpData;

  const commandLineArgs = sinon
    .stub()
    .withArgs(optionDefinitions, { argv })
    .returns({ name: seederName, help: false });

  createStubs({ commandLineArgs, optionDefinitions });

  const expectedOptions = { seederName, helpWanted: false };
  const recivedOptions = getOptions(argv);

  t.true(commandLineArgs.calledWith(optionDefinitions, { argv }));
  t.deepEqual(recivedOptions, expectedOptions);

  restoreStubs();
});

test('should validate given options', t => {
  const createStubs = ({ help }) => {
    moduleRewireAPI.__Rewire__('help', help);
    sinon.stub(console, 'log');
  };
  const restoreStubs = () => {
    moduleRewireAPI.__ResetDependency__('help');
    console.log.restore();
  };

  const help = sinon.stub();

  createStubs({ help });

  t.throws(() => validateOptions());
  t.true(help.called);
  t.true(console.log.called);
  t.throws(() => validateOptions({ helpWanted: false }));
  t.throws(() => validateOptions({ seederName: 'ab' }));
  t.notThrows(() => validateOptions({ seederName: 'abc' }));
  t.notThrows(() => validateOptions({ seederName: 'ab', helpWanted: true }));
  t.notThrows(() => validateOptions({ helpWanted: true }));

  restoreStubs();
});
