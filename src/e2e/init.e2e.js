import test from 'ava';
import sinon from 'sinon';
import path from 'path';
import fs from 'fs';

import FilesSandbox from './utils/files-sandbox';

import { runCommand } from '../lib/commands/helpers';
import config from '../lib/config';

const createSandbox = () => {
  const sandbox = new FilesSandbox('init-');

  const { sandboxPath } = sandbox;

  const examplesFolderName = 'md-seed-example';

  fs.copyFileSync(
    path.join(__dirname, `../../examples/${examplesFolderName}/package.json`),
    path.join(sandboxPath, 'package.json')
  );

  config.update(sandboxPath);

  return sandbox;
};

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

test.serial('md-seed init --seedersFolder=folder-name', async t => {
  const argv = '--seedersFolder=folder-name'.split(' ');

  const sandbox = createSandbox();

  await t.notThrows(runCommand('init', argv));

  const files = sandbox.readFiles();

  sandbox.clean();

  t.snapshot(console.log.args, 'log results');
  t.snapshot(files, 'sandbox content');
});
