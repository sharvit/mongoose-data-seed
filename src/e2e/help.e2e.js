import test from 'ava';
import sinon from 'sinon';

import { runCommand } from '../lib/commands/helpers';

test.beforeEach('mock', t => {
  sinon.stub(console, 'log');
});

test.afterEach('unmock', t => {
  console.log.restore();
});

test('md-seed help', async t => {
  await runCommand('help', '');

  const [[results]] = console.log.args;

  t.snapshot(results);
});
