import test from 'ava';
import sinon from 'sinon';

import usageGuide from './usage-guide';
import help from './index';

test('help command should print the usage guide', async t => {
  sinon.stub(console, 'log');

  await help();

  t.true(console.log.calledWith(usageGuide));

  console.log.restore();
});
