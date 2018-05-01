import test from 'ava';
import sinon from 'sinon';

import FilesSandbox from './utils/files-sandbox';

import { runCommand } from '../lib/commands/helpers';
import config from '../lib/config';

test.beforeEach('mock', t => {
  sinon.stub(console, 'log');
});

test.afterEach('unmock', t => {
  console.log.restore();
});

test.serial('md-seed init --help', async t => {
  await runCommand('init', '--help');
  await runCommand('init', '-h');

  const [[results], [resultsAlias]] = console.log.args;

  t.is(results, resultsAlias);
  t.snapshot(results);
});

test.serial('md-seed init --es6 --seedersFolder=folder-name', async t => {
  const argv = '--es6 --seedersFolder=folder-name'.split(' ');

  const sandbox = new FilesSandbox('init-');
  config.update(sandbox.sandboxPath);

  await t.notThrows(runCommand('init', argv));

  const files = sandbox.readFiles();

  sandbox.clean();

  t.snapshot(console.log.args, 'log results');
  t.snapshot(files, 'sandbox content');
});

test.serial('md-seed init --seedersFolder=folder-name', async t => {
  const argv = '--seedersFolder=folder-name'.split(' ');

  const sandbox = new FilesSandbox('init-');
  config.update(sandbox.sandboxPath);

  await t.notThrows(runCommand('init', argv));

  const files = sandbox.readFiles();

  sandbox.clean();

  t.snapshot(console.log.args, 'log results');
  t.snapshot(files, 'sandbox content');
});
