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
  sinon.stub(global.console, 'log');
});

test.afterEach.always('unmock', t => {
  global.console.log.restore();
});

test.serial('md-seed init --help', async t => {
  await runCommand('init', '--help');
  await runCommand('init', '-h');

  const [[results], [resultsAlias]] = global.console.log.args;

  t.is(results, resultsAlias);
  t.snapshot(results);
});

test.serial(
  'md-seed init --seedersFolder=folder-name seederTemplate=file-path.ejs',
  async t => {
    const argv = '--seedersFolder=folder-name --seederTemplate=file-path.ejs'.split(
      ' '
    );

    const sandbox = createSandbox();

    await runCommand('init', argv);

    const { args: logResults } = global.console.log;
    const files = sandbox.readFiles();

    sandbox.clean();

    t.snapshot(logResults, 'log results');
    t.snapshot(files, 'sandbox content');
  }
);
