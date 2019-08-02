import test from 'ava';
import sinon from 'sinon';

import help, { __RewireAPI__ as moduleRewireAPI } from './help';

test('show show help', t => {
  const createStubs = ({ usageGuide }) => {
    moduleRewireAPI.__Rewire__('usageGuide', usageGuide);
    sinon.stub(console, 'log');
  };
  const restoreStubs = () => {
    moduleRewireAPI.__ResetDependency__('usageGuide');
    console.log.restore();
  };

  const usageGuide = 'some usage guide';

  createStubs({ usageGuide });

  help();

  t.true(console.log.calledWith(usageGuide));

  restoreStubs();
});
