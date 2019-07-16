import test from 'ava';
import sinon from 'sinon';
import path from 'path';
import mongoose from 'mongoose';

import FilesSandbox from './utils/files-sandbox';

import { runCommand } from '../lib/commands/helpers';
import config from '../lib/config';

const getSandboxExamplePath = (exampleName = 'sandbox-1') =>
  path.join(__dirname, `./run-sandboxes/${exampleName}`);

const createSandbox = async sandboxOriginFilesPath => {
  const sandbox = new FilesSandbox('run-');

  await sandbox.copyFolderToSandbox(sandboxOriginFilesPath);

  config.update(sandbox.sandboxPath);

  return sandbox;
};

test.beforeEach('mock', t => {
  sinon.stub(global.console, 'log');
});

test.afterEach.always('unmock', t => {
  global.console.log.restore();
});

test.serial('md-seed run --help', async t => {
  await runCommand('run', '--help');
  await runCommand('run', '-h');

  const [[results], [resultsAlias]] = global.console.log.args;

  t.is(results, resultsAlias);
  t.snapshot(results);
});

test.serial('md-seed run', async t => {
  const sandbox = await createSandbox(getSandboxExamplePath('sandbox-1'));

  await runCommand('run', []);
  const results = global.console.log.args;

  sandbox.clean();
  await mongoose.connection.close();

  t.snapshot(results);
});

test.serial('md-seed run --dropdb', async t => {
  const sandbox = await createSandbox(getSandboxExamplePath('sandbox-1'));

  await runCommand('run', ['--dropdb']);
  const results = global.console.log.args;

  global.console.log.resetHistory();

  await runCommand('run', ['-d']);
  const resultsWithAlias = global.console.log.args;

  sandbox.clean();
  await mongoose.connection.close();

  t.deepEqual(results, resultsWithAlias);
  t.snapshot(results);
});

test.serial('md-seed run seeder1', async t => {
  const sandbox = await createSandbox(getSandboxExamplePath('sandbox-1'));

  await runCommand('run', ['seeder1']);
  const results = global.console.log.args;

  sandbox.clean();
  await mongoose.connection.close();

  t.snapshot(results);
});
