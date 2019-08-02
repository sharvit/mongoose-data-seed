import test from 'ava';
import sinon from 'sinon';
import path from 'path';

import FilesSandbox from './utils/files-sandbox';

import { runCommand } from '../lib/commands/helpers';
import config from '../lib/config';

const getSandboxExamplePath = (exampleName = 'sandbox-1') =>
  path.join(__dirname, `./generate-sandboxes/${exampleName}`);

const createSandbox = async sandboxOriginFilesPath => {
  const sandbox = new FilesSandbox('generate-');

  await sandbox.copyFolderToSandbox(sandboxOriginFilesPath);

  config.update(sandbox.sandboxPath);

  return sandbox;
};

const getFilesForSnapshot = sandbox =>
  sandbox
    .readFiles()
    .filter(
      ({ name }) =>
        name !== 'md-seed-config.js' &&
        name !== 'custom-seeder-template.js' &&
        name !== 'package.json'
    );

test.beforeEach('mock', t => {
  sinon.stub(global.console, 'log');
});

test.afterEach.always('unmock', t => {
  global.console.log.restore();
});

test.serial('md-seed generate --help', async t => {
  await runCommand('generate', '--help');
  await runCommand('generate', '-h');

  const [[results], [resultsAlias]] = global.console.log.args;

  t.is(results, resultsAlias);
  t.snapshot(results);
});

test.serial(
  'md-seed generate some-seeder (fail without md-seed-config.js)',
  async t => {
    const error = await t.throwsAsync(() =>
      runCommand('generate', 'some-seeder')
    );

    t.snapshot(error.message);
  }
);

test.serial('md-seed generate some-seeder', async t => {
  const sandbox = await createSandbox(getSandboxExamplePath('sandbox-1'));

  await t.notThrowsAsync(() => runCommand('generate', 'some-name'));

  const files = getFilesForSnapshot(sandbox);

  sandbox.clean();

  t.snapshot(global.console.log.args, 'log results');
  t.snapshot(files, 'sandbox content');
});

test.serial(
  'md-seed generate some-seeder with custom template and seeders folder',
  async t => {
    const sandbox = await createSandbox(getSandboxExamplePath('sandbox-2'));

    await t.notThrowsAsync(() => runCommand('generate', 'some-name'));

    const files = getFilesForSnapshot(sandbox);

    sandbox.clean();

    t.snapshot(global.console.log.args, 'log results');
    t.snapshot(files, 'sandbox content');
  }
);
