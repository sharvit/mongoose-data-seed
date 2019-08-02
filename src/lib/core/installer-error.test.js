import test from 'ava';

import InstallerError from './installer-error';

test('should create error', t => {
  const error = new InstallerError();

  t.is(error.name, 'InstallerError');
  t.is(error.type, '');
  t.deepEqual(error.payload, { error: {} });
});

test('should create error with type', t => {
  const type = 'some-type';
  const error = new InstallerError({ type });

  t.is(error.name, 'InstallerError');
  t.is(error.type, type);
  t.deepEqual(error.payload, { error: {} });
});

test('should create error with payload', t => {
  const payload = { some: 'payload' };
  const error = new InstallerError({ payload });

  t.is(error.name, 'InstallerError');
  t.is(error.type, '');
  t.deepEqual(error.payload, { ...payload, error: {} });
});

test('should create error with inner error', t => {
  const innerError = new Error('some-error');
  const error = new InstallerError({ error: innerError });

  t.is(error.name, 'InstallerError');
  t.is(error.type, '');
  t.deepEqual(error.payload, { error: innerError });
});
