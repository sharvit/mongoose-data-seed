import test from 'ava';

import MdSeedRunnerError from './md-seed-runner-error';

test('should create error', t => {
  const error = new MdSeedRunnerError();

  t.is(error.name, 'MdSeedRunnerError');
  t.is(error.type, '');
  t.deepEqual(error.payload, { error: {} });
});

test('should create error with type', t => {
  const type = 'some-type';
  const error = new MdSeedRunnerError({ type });

  t.is(error.name, 'MdSeedRunnerError');
  t.is(error.type, type);
  t.deepEqual(error.payload, { error: {} });
});

test('should create error with payload', t => {
  const payload = { some: 'payload' };
  const error = new MdSeedRunnerError({ payload });

  t.is(error.name, 'MdSeedRunnerError');
  t.is(error.type, '');
  t.deepEqual(error.payload, { ...payload, error: {} });
});

test('should create error with inner error', t => {
  const innerError = new Error('some-error');
  const error = new MdSeedRunnerError({ error: innerError });

  t.is(error.name, 'MdSeedRunnerError');
  t.is(error.type, '');
  t.deepEqual(error.payload, { error: innerError });
});
