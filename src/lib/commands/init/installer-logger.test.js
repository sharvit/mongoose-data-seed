import test from 'ava';
import sinon from 'sinon';

import InstallerLogger from './installer-logger';

const createMockedLogger = () => {
  return new InstallerLogger();
};

test.beforeEach('mock', t => {
  sinon.stub(global.console, 'error');
  sinon.stub(global.console, 'log');
});

test.afterEach.always('unmock', t => {
  global.console.error.restore();
  global.console.log.restore();
});

test.serial('Should create a installer-logger instance', t => {
  const logger = new InstallerLogger();

  t.is(typeof logger.asObserver, 'function');
});

test.serial('Should return observer', t => {
  const logger = new InstallerLogger();

  const observer = logger.asObserver();

  t.is(typeof observer.next, 'function');
  t.is(typeof observer.error, 'function');
});

test.serial('Should log WRITE_USER_GENERETOR_CONFIG_SUCCESS', t => {
  const logger = createMockedLogger();

  const type = 'WRITE_USER_GENERETOR_CONFIG_SUCCESS';
  logger.next({ type });

  t.true(global.console.log.calledWith(sinon.match(/UPDATED/)));
  t.true(global.console.log.calledWith(sinon.match(/package.json/)));
});

test.serial(
  'Should log CREATE_CUSTOM_SEEDER_TEMPLATE_FILE_SKIP_FILE_EXISTS',
  t => {
    const logger = createMockedLogger();

    const type = 'CREATE_CUSTOM_SEEDER_TEMPLATE_FILE_SKIP_FILE_EXISTS';
    const payload = { customSeederTemplateFilename: 'some-filename' };

    logger.next({ type, payload });

    t.true(global.console.log.calledWith(sinon.match(/SKIP/)));
    t.true(global.console.log.calledWith(sinon.match(/are already exists/)));
    t.true(
      global.console.log.calledWith(
        sinon.match(payload.customSeederTemplateFilename)
      )
    );
  }
);

test.serial('Should log CREATE_CUSTOM_SEEDER_TEMPLATE_FILE_SUCCESS', t => {
  const logger = createMockedLogger();

  const type = 'CREATE_CUSTOM_SEEDER_TEMPLATE_FILE_SUCCESS';
  const payload = { customSeederTemplateFilename: 'some-filename' };

  logger.next({ type, payload });

  t.true(global.console.log.calledWith(sinon.match(/CREATED/)));
  t.true(
    global.console.log.calledWith(
      sinon.match(payload.customSeederTemplateFilename)
    )
  );
});

test.serial('Should log CREATE_SEEDERS_FOLDER_SKIP_FOLDER_EXISTS', t => {
  const logger = createMockedLogger();

  const type = 'CREATE_SEEDERS_FOLDER_SKIP_FOLDER_EXISTS';
  const payload = { foldername: 'some-foldername' };

  logger.next({ type, payload });

  t.true(global.console.log.calledWith(sinon.match(/SKIP/)));
  t.true(global.console.log.calledWith(sinon.match(/are already exists/)));
  t.true(global.console.log.calledWith(sinon.match(payload.foldername)));
});

test.serial('Should log CREATE_SEEDERS_FOLDER_SUCCESS', t => {
  const logger = createMockedLogger();

  const type = 'CREATE_SEEDERS_FOLDER_SUCCESS';
  const payload = { foldername: 'some-foldername' };

  logger.next({ type, payload });

  t.true(global.console.log.calledWith(sinon.match(/CREATED/)));
  t.true(global.console.log.calledWith(sinon.match(payload.foldername)));
});

test.serial('Should log WRITE_USER_CONFIG_SKIP_FILE_EXISTS', t => {
  const logger = createMockedLogger();

  const type = 'WRITE_USER_CONFIG_SKIP_FILE_EXISTS';
  const payload = { filename: 'some-filename' };

  logger.next({ type, payload });

  t.true(global.console.log.calledWith(sinon.match(/SKIP/)));
  t.true(global.console.log.calledWith(sinon.match(/are already exists/)));
  t.true(global.console.log.calledWith(sinon.match(payload.filename)));
});

test.serial('Should log WRITE_USER_CONFIG_SUCCESS', t => {
  const logger = createMockedLogger();

  const type = 'WRITE_USER_CONFIG_SUCCESS';
  const payload = { filename: 'some-filename' };

  logger.next({ type, payload });

  t.true(global.console.log.calledWith(sinon.match(/CREATED/)));
  t.true(global.console.log.calledWith(sinon.match(payload.filename)));
});

test.serial('Should log WRITE_USER_GENERETOR_CONFIG_ERROR', t => {
  const logger = createMockedLogger();

  const type = 'WRITE_USER_GENERETOR_CONFIG_ERROR';
  const payload = { error: 'some-error', filepath: 'some-filepath' };

  logger.error({ type, payload });

  t.true(global.console.log.calledWith(sinon.match(/ERROR/)));
  t.true(
    global.console.log.calledWith(sinon.match(/Unable to write config file/))
  );
  t.true(global.console.log.calledWith(sinon.match(payload.filepath)));
  t.true(global.console.error.calledWith(payload.error));
});

test.serial('Should log CREATE_CUSTOM_SEEDER_TEMPLATE_FILE_ERROR', t => {
  const logger = createMockedLogger();

  const type = 'CREATE_CUSTOM_SEEDER_TEMPLATE_FILE_ERROR';
  const payload = {
    error: 'some-error',
    customSeederTemplatePath: 'some-filename',
  };

  logger.error({ type, payload });

  t.true(global.console.log.calledWith(sinon.match(/ERROR/)));
  t.true(
    global.console.log.calledWith(
      sinon.match(/Unable to create custom seeder template/)
    )
  );
  t.true(
    global.console.log.calledWith(sinon.match(payload.customSeederTemplatePath))
  );
  t.true(global.console.error.calledWith(payload.error));
});

test.serial('Should log CREATE_SEEDERS_FOLDER_ERROR', t => {
  const logger = createMockedLogger();

  const type = 'CREATE_SEEDERS_FOLDER_ERROR';
  const payload = { error: 'some-error', folderpath: 'some-folderpath' };

  logger.error({ type, payload });

  t.true(global.console.log.calledWith(sinon.match(/ERROR/)));
  t.true(
    global.console.log.calledWith(
      sinon.match(/Unable to create seeders folder/)
    )
  );
  t.true(global.console.log.calledWith(sinon.match(payload.folderpath)));
  t.true(global.console.error.calledWith(payload.error));
});

test.serial('Should log WRITE_USER_CONFIG_ERROR', t => {
  const logger = createMockedLogger();

  const type = 'WRITE_USER_CONFIG_ERROR';
  const payload = { error: 'some-error', filepath: 'some-filepath' };

  logger.error({ type, payload });

  t.true(global.console.log.calledWith(sinon.match(/ERROR/)));
  t.true(
    global.console.log.calledWith(
      sinon.match(/Unable to write user config file/)
    )
  );
  t.true(global.console.log.calledWith(sinon.match(payload.filepath)));
  t.true(global.console.error.calledWith(payload.error));
});

test.serial('Should log error', t => {
  const logger = createMockedLogger();

  const payload = { error: 'some-error' };

  logger.error({ type: 'some-type', payload });

  t.true(global.console.error.calledWith(payload.error));
});

test.serial('Should log error without inner error', t => {
  const logger = createMockedLogger();

  const payload = {};

  logger.error({ type: 'some-type', payload });

  t.false(global.console.error.called);
});
