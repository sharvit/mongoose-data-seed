import test from 'ava';
import sinon from 'sinon';

import { mockImports, resetImports } from '../../utils/test-helpers';

import RunLogger, { __RewireAPI__ as moduleRewireAPI } from './run-logger';

const createMockedLogger = () => {
  const logger = new RunLogger();

  logger.spinner = {
    start: sinon.stub(),
    stop: sinon.stub(),
    message: sinon.stub(),
  };

  return logger;
};

test.beforeEach('mock imports', t => {
  const mocks = {
    clui: { Spinner: sinon.stub() },
  };

  t.context = { mocks };

  mockImports({ moduleRewireAPI, mocks });

  sinon.stub(console, 'log');
});

test.afterEach('unmock imports', t => {
  const imports = Object.keys(t.context.mocks);

  resetImports({ moduleRewireAPI, imports });

  console.log.restore();
});

test('Should create a run-logger instance', t => {
  const logger = new RunLogger();

  t.is(typeof logger.asObserver, 'function');
});

test('Should return observer', t => {
  const logger = new RunLogger();

  const observer = logger.asObserver();

  t.is(typeof observer.next, 'function');
  t.is(typeof observer.error, 'function');
});

test('Should log MONGOOSE_CONNECT_START', t => {
  const logger = createMockedLogger();

  const type = 'MONGOOSE_CONNECT_START';

  logger.next({ type });

  t.true(logger.spinner.stop.calledOnce);
  t.true(logger.spinner.message.calledOnce);
  t.true(logger.spinner.start.calledOnce);
});

test('Should log MONGOOSE_CONNECT_SUCCESS', t => {
  const logger = createMockedLogger();

  const type = 'MONGOOSE_CONNECT_SUCCESS';

  logger.next({ type });

  t.true(logger.spinner.stop.calledOnce);
  t.true(
    console.log.calledWith(sinon.match(/Successfully connected to MongoDB/))
  );
});

test('Should log MONGOOSE_DROP_START', t => {
  const logger = createMockedLogger();

  logger.next({ type: 'MONGOOSE_DROP_START' });

  t.true(logger.spinner.stop.calledOnce);
  t.true(logger.spinner.message.calledOnce);
  t.true(logger.spinner.start.calledOnce);
});

test('Should log MONGOOSE_DROP_SUCCESS', t => {
  const logger = createMockedLogger();

  logger.next({ type: 'MONGOOSE_DROP_SUCCESS' });

  t.true(logger.spinner.stop.calledOnce);
  t.true(console.log.calledWith(sinon.match(/Database dropped/)));
});

test('Should log ALL_SEEDERS_START', t => {
  const logger = createMockedLogger();

  logger.next({ type: 'ALL_SEEDERS_START' });

  t.true(logger.spinner.stop.calledOnce);
  t.true(console.log.calledWith(sinon.match(/Seeding Results/)));
});

test('Should log ALL_SEEDERS_FINISH', t => {
  const logger = createMockedLogger();

  logger.next({ type: 'ALL_SEEDERS_FINISH' });

  t.true(logger.spinner.stop.calledOnce);
  t.true(console.log.calledWith(sinon.match(/Done/)));
});

test('Should log SEEDER_START', t => {
  const logger = createMockedLogger();

  const payload = { name: 'some-name' };

  logger.next({ type: 'SEEDER_START', payload });

  t.true(logger.spinner.stop.calledOnce);
  t.true(logger.spinner.message.calledWith(payload.name));
  t.true(logger.spinner.start.calledOnce);
});

test('Should log SEEDER_SUCCESS', t => {
  const logger = createMockedLogger();

  const payload = { name: 'some-name', results: { run: true, created: '10' } };

  logger.next({ type: 'SEEDER_SUCCESS', payload });

  t.true(logger.spinner.stop.calledOnce);
  t.true(console.log.calledWith(sinon.match(payload.name)));
  t.true(console.log.calledWith(sinon.match(payload.results.created)));
});

test('Should log SEEDER_SUCCESS with run=false', t => {
  const logger = createMockedLogger();

  const payload = { name: 'some-name', results: { run: false, created: '0' } };

  logger.next({ type: 'SEEDER_SUCCESS', payload });

  t.true(logger.spinner.stop.calledOnce);
  t.true(console.log.calledWith(sinon.match(payload.name)));
  t.true(console.log.calledWith(sinon.match(payload.results.created)));
});

test('Should log MONGOOSE_CONNECT_ERROR', t => {
  const logger = createMockedLogger();

  logger.error({ type: 'MONGOOSE_CONNECT_ERROR' });

  t.true(logger.spinner.stop.calledOnce);
  t.true(console.log.calledWith(sinon.match(/Unable to connected to MongoDB/)));
});

test('Should log MONGOOSE_DROP_ERROR', t => {
  const logger = createMockedLogger();

  logger.error({ type: 'MONGOOSE_DROP_ERROR' });

  t.true(logger.spinner.stop.calledOnce);
  t.true(console.log.calledWith(sinon.match(/Unable to drop database/)));
});

test('Should log SEEDER_ERROR', t => {
  const logger = createMockedLogger();

  const payload = { name: 'some-name' };

  logger.error({ type: 'SEEDER_ERROR', payload });

  t.true(logger.spinner.stop.calledOnce);
  t.true(console.log.calledWith(sinon.match(payload.name)));
});

test('Should log error', t => {
  sinon.stub(console, 'error');

  const logger = createMockedLogger();

  const payload = { error: 'some-error' };

  logger.error({ type: 'some-type', payload });

  t.true(logger.spinner.stop.calledOnce);
  t.true(console.error.calledWith(payload.error));

  console.error.restore();
});
