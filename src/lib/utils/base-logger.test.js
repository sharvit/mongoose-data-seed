import test from 'ava';
import sinon from 'sinon';

import BaseLogger from './base-logger';

test('Should create a installer-logger instance', t => {
  const logger = new BaseLogger();

  logger.next();
  logger.error();
  logger.complete();

  t.is(typeof logger.asObserver, 'function');
});

test('Should return observer', t => {
  const context = {
    next: sinon.stub(),
    error: sinon.stub(),
    complete: sinon.stub(),
  };

  const observer = BaseLogger.prototype.asObserver.call(context);

  const nextArgs = ['some', 'args', 'next'];
  const errorArgs = ['some', 'args', 'error'];
  const completeArgs = ['some', 'args', 'complete'];

  observer.next(...nextArgs);
  observer.error(...errorArgs);
  observer.complete(...completeArgs);

  t.true(context.next.calledWith(...nextArgs));
  t.true(context.error.calledWith(...errorArgs));
  t.true(context.complete.calledWith(...completeArgs));
});
