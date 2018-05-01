import test from 'ava';
import sinon from 'sinon';
import path from 'path';
import fs from 'fs';

import FilesSandbox from './utils/files-sandbox';

import { runCommand } from '../lib/commands/helpers';
import config from '../lib/config';

const createSandbox = (es6 = false) => {
  const sandbox = new FilesSandbox('generate-');

  const { sandboxPath } = sandbox;

  const examplesFolderName = es6
    ? 'md-seed-example-es2015-babel'
    : 'md-seed-example-es5';

  fs.copyFileSync(
    path.join(
      __dirname,
      `../../examples/${examplesFolderName}/md-seed-generator.json`
    ),
    path.join(sandboxPath, 'md-seed-generator.json')
  );
  fs.copyFileSync(
    path.join(
      __dirname,
      `../../examples/${examplesFolderName}/md-seed-config.js`
    ),
    path.join(sandboxPath, 'md-seed-config.js')
  );

  config.update(sandboxPath);

  return sandbox;
};

const getFilesForSnapshot = sandbox =>
  sandbox
    .readFiles()
    .filter(
      ({ name }) =>
        name !== 'md-seed-config.js' && name !== 'md-seed-generator.json'
    );

test.beforeEach('mock', t => {
  sinon.stub(console, 'log');
});

test.afterEach('unmock', t => {
  console.log.restore();
});

test.serial('md-seed generate --help', async t => {
  await runCommand('generate', '--help');
  await runCommand('generate', '-h');

  const [[results], [resultsAlias]] = console.log.args;

  t.is(results, resultsAlias);
  t.snapshot(results);
});

test.serial(
  'md-seed generate some-seeder (fail without md-seed-config.js)',
  async t => {
    const error = await t.throws(runCommand('generate', 'some-seeder'));

    t.snapshot(error.message);
  }
);

test.serial('md-seed generate some-seeder (es2015)', async t => {
  const sandbox = createSandbox(true);

  await t.notThrows(runCommand('generate', 'some-name'));

  const files = getFilesForSnapshot(sandbox);

  sandbox.clean();

  t.snapshot(console.log.args, 'log results');
  t.snapshot(files, 'sandbox content');
});

test.serial('md-seed generate some-seeder (es5)', async t => {
  const sandbox = createSandbox(false);

  await t.notThrows(runCommand('generate', 'some-name'));

  const files = getFilesForSnapshot(sandbox);

  sandbox.clean();

  t.snapshot(console.log.args, 'log results');
  t.snapshot(files, 'sandbox content');
});
