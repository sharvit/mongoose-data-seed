import test from 'ava';
import sinon from 'sinon';

import InstallerLogger, {
  __RewireAPI__ as moduleRewireAPI,
} from './installer-logger';

const createMockedLogger = () => {
  return new InstallerLogger();
};

test.beforeEach('mock', t => {
  sinon.stub(console, 'error');
  sinon.stub(console, 'log');
});

test.afterEach('unmock', t => {
  console.error.restore();
  console.log.restore();
});

test('Should create a installer-logger instance', t => {
  const logger = new InstallerLogger();

  t.is(typeof logger.asObserver, 'function');
});

test('Should return observer', t => {
  const logger = new InstallerLogger();

  const observer = logger.asObserver();

  t.is(typeof observer.next, 'function');
  t.is(typeof observer.error, 'function');
});

test('Should log WRITE_USER_GENERETOR_CONFIG_SKIP_FILE_EXISTS', t => {
  const logger = createMockedLogger();

  const type = 'WRITE_USER_GENERETOR_CONFIG_SKIP_FILE_EXISTS';
  const payload = { filename: 'some-filename' };

  logger.next({ type, payload });

  t.true(console.log.calledWith(sinon.match(/SKIP/)));
  t.true(console.log.calledWith(sinon.match(/are already exists/)));
  t.true(console.log.calledWith(sinon.match(payload.filename)));
});

test('Should log WRITE_USER_GENERETOR_CONFIG_SUCCESS', t => {
  const logger = createMockedLogger();

  const type = 'WRITE_USER_GENERETOR_CONFIG_SUCCESS';
  const payload = { filename: 'some-filename' };

  logger.next({ type, payload });

  t.true(console.log.calledWith(sinon.match(/CREATED/)));
  t.true(console.log.calledWith(sinon.match(payload.filename)));
});

test('Should log CREARE_SEEDERS_FOLDER_SKIP_FOLDER_EXISTS', t => {
  const logger = createMockedLogger();

  const type = 'CREARE_SEEDERS_FOLDER_SKIP_FOLDER_EXISTS';
  const payload = { foldername: 'some-foldername' };

  logger.next({ type, payload });

  t.true(console.log.calledWith(sinon.match(/SKIP/)));
  t.true(console.log.calledWith(sinon.match(/are already exists/)));
  t.true(console.log.calledWith(sinon.match(payload.foldername)));
});

test('Should log CREARE_SEEDERS_FOLDER_SUCCESS', t => {
  const logger = createMockedLogger();

  const type = 'CREARE_SEEDERS_FOLDER_SUCCESS';
  const payload = { foldername: 'some-foldername' };

  logger.next({ type, payload });

  t.true(console.log.calledWith(sinon.match(/CREATED/)));
  t.true(console.log.calledWith(sinon.match(payload.foldername)));
});

test('Should log WRITE_USER_CONFIG_SKIP_FILE_EXISTS', t => {
  const logger = createMockedLogger();

  const type = 'WRITE_USER_CONFIG_SKIP_FILE_EXISTS';
  const payload = { filename: 'some-filename' };

  logger.next({ type, payload });

  t.true(console.log.calledWith(sinon.match(/SKIP/)));
  t.true(console.log.calledWith(sinon.match(/are already exists/)));
  t.true(console.log.calledWith(sinon.match(payload.filename)));
});

test('Should log WRITE_USER_CONFIG_SUCCESS', t => {
  const logger = createMockedLogger();

  const type = 'WRITE_USER_CONFIG_SUCCESS';
  const payload = { filename: 'some-filename' };

  logger.next({ type, payload });

  t.true(console.log.calledWith(sinon.match(/CREATED/)));
  t.true(console.log.calledWith(sinon.match(payload.filename)));
});

test('Should log WRITE_USER_GENERETOR_CONFIG_ERROR', t => {
  const logger = createMockedLogger();

  const type = 'WRITE_USER_GENERETOR_CONFIG_ERROR';
  const payload = { error: 'some-error', filepath: 'some-filepath' };

  logger.error({ type, payload });

  t.true(console.log.calledWith(sinon.match(/ERROR/)));
  t.true(console.log.calledWith(sinon.match(/Unable to write config file/)));
  t.true(console.log.calledWith(sinon.match(payload.filepath)));
  t.true(console.error.calledWith(payload.error));
});

test('Should log CREARE_SEEDERS_FOLDER_ERROR', t => {
  const logger = createMockedLogger();

  const type = 'CREARE_SEEDERS_FOLDER_ERROR';
  const payload = { error: 'some-error', folderpath: 'some-folderpath' };

  logger.error({ type, payload });

  t.true(console.log.calledWith(sinon.match(/ERROR/)));
  t.true(
    console.log.calledWith(sinon.match(/Unable to create seeders folder/))
  );
  t.true(console.log.calledWith(sinon.match(payload.folderpath)));
  t.true(console.error.calledWith(payload.error));
});

test('Should log WRITE_USER_CONFIG_ERROR', t => {
  const logger = createMockedLogger();

  const type = 'WRITE_USER_CONFIG_ERROR';
  const payload = { error: 'some-error', filepath: 'some-filepath' };

  logger.error({ type, payload });

  t.true(console.log.calledWith(sinon.match(/ERROR/)));
  t.true(
    console.log.calledWith(sinon.match(/Unable to write user config file/))
  );
  t.true(console.log.calledWith(sinon.match(payload.filepath)));
  t.true(console.error.calledWith(payload.error));
});

test('Should log error', t => {
  const logger = createMockedLogger();

  const payload = { error: 'some-error' };

  logger.error({ type: 'some-type', payload });

  t.true(console.error.calledWith(payload.error));
});

test('Should log error without inner error', t => {
  const logger = createMockedLogger();

  const payload = {};

  logger.error({ type: 'some-type', payload });

  t.false(console.error.called);
});
