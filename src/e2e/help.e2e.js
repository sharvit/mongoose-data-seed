import test from 'ava';
import sinon from 'sinon';

import { runCommand } from '../lib/commands/helpers';

test.beforeEach('mock', t => {
  sinon.stub(global.console, 'log');
});

test.afterEach.always('unmock', t => {
  global.console.log.restore();
});

test('md-seed help', async t => {
  await runCommand('help', '');

  const [[results]] = global.console.log.args;

  t.snapshot(results);
});
