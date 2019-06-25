import test from 'ava';
import sinon from 'sinon';

import { mockImports, resetImports } from '../../utils/test-helpers';

import { getOptions, __RewireAPI__ as moduleRewireAPI } from './options';

const helpData = {
  argv: 'some-argv',
  seeders: 'some-seeders',
  dropdb: true,
  help: false,
};

test.beforeEach('mock imports', t => {
  const mocks = {
    optionDefinitions: 'some option definitions',
    commandLineArgs: sinon.stub(),
  };

  t.context = { mocks };

  mockImports({ moduleRewireAPI, mocks });
});

test.afterEach.always('unmock imports', t => {
  const imports = Object.keys(t.context.mocks);

  resetImports({ moduleRewireAPI, imports });
});

test('should get user options from the cli', t => {
  const { argv, seeders, dropdb, help } = helpData;

  const { commandLineArgs, optionDefinitions } = t.context.mocks;

  commandLineArgs.withArgs(optionDefinitions, { argv }).returns({
    seeders,
    dropdb,
    help,
  });

  const expectedOptions = {
    selectedSeeders: seeders,
    dropDatabase: dropdb,
    helpWanted: help,
  };
  const recivedOptions = getOptions(argv);

  t.true(commandLineArgs.calledWith(optionDefinitions, { argv }));
  t.deepEqual(recivedOptions, expectedOptions);
});
