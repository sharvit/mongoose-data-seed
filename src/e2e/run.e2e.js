import test from 'ava';
import sinon from 'sinon';
import path from 'path';
import { ncp } from 'ncp';

import FilesSandbox from './utils/files-sandbox';

import { runCommand } from '../lib/commands/helpers';
import config from '../lib/config';

const getSandboxExamplePath = (exampleName = 'sandbox-1') =>
  path.join(__dirname, `./run-sandboxes/${exampleName}`);

const copyFolder = (source, destination) =>
  new Promise((resolve, reject) => {
    ncp(source, destination, err => {
      if (err) return reject(err);
      resolve();
    });
  });

const createSandbox = async sandboxOriginFilesPath => {
  const sandbox = new FilesSandbox('run-');
  const { sandboxPath } = sandbox;

  await copyFolder(sandboxOriginFilesPath, sandboxPath);

  config.update(sandboxPath);

  return sandbox;
};

test.beforeEach('mock', t => {
  sinon.stub(console, 'log');
});

test.afterEach('unmock', t => {
  console.log.restore();
});

test.serial('md-seed run --help', async t => {
  await runCommand('run', '--help');
  await runCommand('run', '-h');

  const [[results], [resultsAlias]] = console.log.args;

  t.is(results, resultsAlias);
  t.snapshot(results);
});

test.serial('md-seed run', async t => {
  const sandbox = await createSandbox(getSandboxExamplePath('sandbox-1'));

  await runCommand('run', []);

  sandbox.clean();

  const results = console.log.args;

  t.snapshot(results);
});

test.serial('md-seed run --dropdb', async t => {
  const sandbox = await createSandbox(getSandboxExamplePath('sandbox-1'));

  await runCommand('run', ['--dropdb']);
  const results = console.log.args;

  console.log.resetHistory();

  await runCommand('run', ['-d']);
  const resultsWithAlias = console.log.args;

  sandbox.clean();

  t.deepEqual(results, resultsWithAlias);
  t.snapshot(results);
});

test.serial('md-seed run seeder1', async t => {
  const sandbox = await createSandbox(getSandboxExamplePath('sandbox-1'));

  await runCommand('run', ['seeder1']);
  const results = console.log.args;

  sandbox.clean();

  t.snapshot(results);
});
