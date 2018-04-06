import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/toArray';

import test from 'ava';
import sinon from 'sinon';

import Subject from '../../__mocks__/rxjs-subject';
import fs, { alreadyExistsPath, throwableMkdirPath } from '../../__mocks__/fs';
import memFs, { store } from '../../__mocks__/mem-fs';
import memFsEditor, {
  fs as memFsEditorFs,
} from '../../__mocks__/mem-fs-editor';

import { mockImports, resetImports } from '../utils/test-helpers';

import InstallerError from './installer-error';

import Installer, { __RewireAPI__ as moduleRewireAPI } from './installer';

const helpData = {
  es6: true,
  seedersFolder: 'seeders-folder',
};

const defaultConfig = {
  projectRoot: '/project/root',
  userGeneratorConfigExists: true,
  userGeneratorConfigFilename: 'generator-config-filename.json',
  userGeneratorConfigFilepath: '/project/root/generator-config-filename.json',
  userConfigExists: true,
  userConfigFilename: 'config-filename.js',
  userConfigFilepath: '/project/root/config-filename.js',
  es6ConfigTemplate: '/template/folder/es6-config-template.js',
  es5ConfigTemplate: '/template/folder/es5-config-template.js',
};

test.beforeEach('mock imports', t => {
  const mocks = {
    Subject,
    fs,
    memFs,
    editor: memFsEditor,
    config: { ...defaultConfig },
    getObjectWithSelectedKeys: sinon.stub(),
    normalizeSeederName: sinon.stub().returnsArg(0),
  };

  t.context = { mocks };

  mockImports({ moduleRewireAPI, mocks });
});

test.afterEach('unmock imports', t => {
  const imports = Object.keys(t.context.mocks);

  resetImports({ moduleRewireAPI, imports });
});

test('Should create a installer instance', t => {
  sinon.stub(Installer.prototype, '_initConfig');
  sinon.stub(Installer.prototype, '_initMemFs');

  const installer = new Installer();

  t.truthy(installer.subject);
  t.is(typeof installer.install, 'function');
  t.true(
    installer._initConfig.calledWith({ es6: false, seedersFolder: 'seeders' })
  );
  t.true(installer._initMemFs.called);

  Installer.prototype._initConfig.restore();
  Installer.prototype._initMemFs.restore();
});

test('Should create a installer instance with args', t => {
  sinon.stub(Installer.prototype, '_initConfig');
  sinon.stub(Installer.prototype, '_initMemFs');

  const installer = new Installer({ ...helpData });

  t.truthy(installer.subject);
  t.is(typeof installer.install, 'function');
  t.true(installer._initConfig.calledWith({ ...helpData }));
  t.true(installer._initMemFs.called);

  Installer.prototype._initConfig.restore();
  Installer.prototype._initMemFs.restore();
});

test('Should _initConfig', t => {
  const context = {};
  const _initConfig = Installer.prototype._initConfig.bind(context);

  _initConfig({ ...helpData, es6: false });

  t.snapshot(context);
});

test('Should _initConfig with es6 flag', t => {
  const context = {};
  const _initConfig = Installer.prototype._initConfig.bind(context);

  _initConfig({ ...helpData, es6: true });

  t.snapshot(context);
});

test('Should _initMemFs', t => {
  const { mocks } = t.context;

  const context = {};
  const _initMemFs = Installer.prototype._initMemFs.bind(context);

  _initMemFs();

  t.true(mocks.memFs.create.called);
  t.true(mocks.editor.create.calledWith(store));
  t.is(context.memFsEditor, memFsEditorFs);
});

test('Should install', t => {
  const context = {
    _install: sinon.stub().resolves(),
    subject: { asObservable: () => 'observable' },
  };
  const install = Installer.prototype.install.bind(context);

  const results = install();

  t.is(results, 'observable');
  t.true(context._install.called);
});

test('Should getGeneratorConfig', t => {
  const context = {
    config: {
      useEs6Generator: true,
      userSeedersFolderName: 'foldername',
    },
  };
  const getGeneratorConfig = Installer.prototype.getGeneratorConfig.bind(
    context
  );

  const results = getGeneratorConfig();

  t.deepEqual(results, { es6: true, seedersFolder: 'foldername' });
});

test('Should _install and success', async t => {
  const context = {
    _writeUserGeneratorConfig: sinon.stub().resolves(),
    _createSeedersFolder: sinon.stub().resolves(),
    _writeUserConfig: sinon.stub().resolves(),
    subject: {
      next: sinon.stub(),
      complete: sinon.stub(),
      error: sinon.stub(),
    },
  };
  const _install = Installer.prototype._install.bind(context);

  await _install();

  t.true(context._writeUserGeneratorConfig.called);
  t.true(context._createSeedersFolder.called);
  t.true(context._writeUserConfig.called);
  t.true(context.subject.next.calledWith({ type: 'START' }));
  t.true(context.subject.next.calledWith({ type: 'SUCCESS' }));
  t.true(context.subject.complete.called);
  t.false(context.subject.error.called);
});

test('Should _install and fail', async t => {
  const error = new Error('some-error');
  const context = {
    _writeUserGeneratorConfig: sinon.stub().resolves(),
    _createSeedersFolder: sinon.stub().rejects(error),
    _writeUserConfig: sinon.stub().resolves(),
    subject: {
      next: sinon.stub(),
      complete: sinon.stub(),
      error: sinon.stub(),
    },
  };
  const _install = Installer.prototype._install.bind(context);

  await _install();

  t.true(context._writeUserGeneratorConfig.called);
  t.true(context._createSeedersFolder.called);
  t.false(context._writeUserConfig.called);
  t.true(context.subject.next.calledWith({ type: 'START' }));
  t.false(context.subject.next.calledWith({ type: 'SUCCESS' }));
  t.false(context.subject.complete.called);
  t.true(
    context.subject.error.calledWith({ type: 'ERROR', payload: { error } })
  );
});

test('Should _install and fail with InstallerError', async t => {
  const type = 'CREARE_SEEDERS_FOLDER_ERROR';
  const payload = { some: 'data' };
  const baseError = new Error('some-base-error');

  const error = new InstallerError({ type, payload, error: baseError });
  const context = {
    _writeUserGeneratorConfig: sinon.stub().resolves(),
    _createSeedersFolder: sinon.stub().rejects(error),
    _writeUserConfig: sinon.stub().resolves(),
    subject: {
      next: sinon.stub(),
      complete: sinon.stub(),
      error: sinon.stub(),
    },
  };
  const _install = Installer.prototype._install.bind(context);

  await _install();

  t.true(context._writeUserGeneratorConfig.called);
  t.true(context._createSeedersFolder.called);
  t.false(context._writeUserConfig.called);
  t.true(context.subject.next.calledWith({ type: 'START' }));
  t.false(context.subject.next.calledWith({ type: 'SUCCESS' }));
  t.false(context.subject.complete.called);
  t.true(
    context.subject.error.calledWith({
      type,
      payload: { ...payload, error: baseError },
    })
  );
});

test('Should _commitMemFsChanges', async t => {
  const context = {
    memFsEditor: { commit: sinon.stub().callsArg(0) },
  };
  const _commitMemFsChanges = Installer.prototype._commitMemFsChanges.bind(
    context
  );

  await _commitMemFsChanges();

  t.true(context.memFsEditor.commit.called);
});

test('Should _writeUserGeneratorConfig and success', async t => {
  const config = {
    userGeneratorConfigExists: false,
    userGeneratorConfigFilename: 'filename.js',
    userGeneratorConfigFilepath: '/file/path',
  };
  const generatorConfig = { es6: true, seedersFolder: '/some/folder' };
  const payload = {
    fileExists: config.userGeneratorConfigExists,
    filename: config.userGeneratorConfigFilename,
    filepath: config.userGeneratorConfigFilepath,
  };
  const subject = new Subject();
  const context = {
    subject,
    config,
    _commitMemFsChanges: sinon.stub().resolves(),
    memFsEditor: { writeJSON: sinon.stub() },
    getGeneratorConfig: () => generatorConfig,
  };
  const _writeUserGeneratorConfig = Installer.prototype._writeUserGeneratorConfig.bind(
    context
  );

  await t.notThrows(_writeUserGeneratorConfig());

  t.true(
    subject.next.calledWith({
      type: 'WRITE_USER_GENERETOR_CONFIG_START',
      payload,
    })
  );
  t.false(
    subject.next.calledWith({
      type: 'WRITE_USER_GENERETOR_CONFIG_SKIP_FILE_EXISTS',
      payload,
    })
  );
  t.true(
    subject.next.calledWith({
      type: 'WRITE_USER_GENERETOR_CONFIG_SUCCESS',
      payload,
    })
  );
  t.true(
    context.memFsEditor.writeJSON.calledWith(payload.filepath, generatorConfig)
  );
  t.true(context._commitMemFsChanges.called);
});

test('Should _writeUserGeneratorConfig and skip', async t => {
  const config = {
    userGeneratorConfigExists: true,
    userGeneratorConfigFilename: 'filename.js',
    userGeneratorConfigFilepath: '/file/path',
  };
  const generatorConfig = { es6: true, seedersFolder: '/some/folder' };
  const payload = {
    fileExists: config.userGeneratorConfigExists,
    filename: config.userGeneratorConfigFilename,
    filepath: config.userGeneratorConfigFilepath,
  };
  const subject = new Subject();
  const context = {
    subject,
    config,
    _commitMemFsChanges: sinon.stub().resolves(),
    memFsEditor: { writeJSON: sinon.stub() },
    getGeneratorConfig: () => generatorConfig,
  };
  const _writeUserGeneratorConfig = Installer.prototype._writeUserGeneratorConfig.bind(
    context
  );

  await t.notThrows(_writeUserGeneratorConfig());

  t.true(
    subject.next.calledWith({
      type: 'WRITE_USER_GENERETOR_CONFIG_START',
      payload,
    })
  );
  t.true(
    subject.next.calledWith({
      type: 'WRITE_USER_GENERETOR_CONFIG_SKIP_FILE_EXISTS',
      payload,
    })
  );
  t.false(
    subject.next.calledWith({
      type: 'WRITE_USER_GENERETOR_CONFIG_SUCCESS',
      payload,
    })
  );
  t.false(context.memFsEditor.writeJSON.called);
  t.false(context._commitMemFsChanges.called);
});

test('Should _writeUserGeneratorConfig and fail', async t => {
  const config = {
    userGeneratorConfigExists: false,
    userGeneratorConfigFilename: 'filename.js',
    userGeneratorConfigFilepath: '/file/path',
  };
  const generatorConfig = { es6: true, seedersFolder: '/some/folder' };
  const payload = {
    fileExists: config.userGeneratorConfigExists,
    filename: config.userGeneratorConfigFilename,
    filepath: config.userGeneratorConfigFilepath,
  };
  const subject = new Subject();
  const error = new Error('some-error');
  const context = {
    subject,
    config,
    _commitMemFsChanges: sinon.stub().rejects(error),
    memFsEditor: { writeJSON: sinon.stub() },
    getGeneratorConfig: () => generatorConfig,
  };
  const _writeUserGeneratorConfig = Installer.prototype._writeUserGeneratorConfig.bind(
    context
  );

  const rejectionError = await t.throws(_writeUserGeneratorConfig());

  t.is(rejectionError.type, 'WRITE_USER_GENERETOR_CONFIG_ERROR');
  t.deepEqual(rejectionError.payload, { ...payload, error });
  t.true(
    subject.next.calledWith({
      type: 'WRITE_USER_GENERETOR_CONFIG_START',
      payload,
    })
  );
  t.false(
    subject.next.calledWith({
      type: 'WRITE_USER_GENERETOR_CONFIG_SKIP_FILE_EXISTS',
      payload,
    })
  );
  t.false(
    subject.next.calledWith({
      type: 'WRITE_USER_GENERETOR_CONFIG_SUCCESS',
      payload,
    })
  );
  t.true(context.memFsEditor.writeJSON.called);
  t.true(context._commitMemFsChanges.called);
});

test('Should _createSeedersFolder and success', async t => {
  const { mocks } = t.context;
  const folderpath = '/some/folder/path/folder';
  const foldername = folderpath.split('/').pop();
  const payload = { folderpath, foldername };
  const config = {
    userSeedersFolderPath: folderpath,
    userSeedersFolderName: foldername,
  };
  const subject = new Subject();
  const context = { subject, config };
  const _createSeedersFolder = Installer.prototype._createSeedersFolder.bind(
    context
  );

  await t.notThrows(_createSeedersFolder());

  t.true(
    subject.next.calledWith({
      type: 'CREARE_SEEDERS_FOLDER_START',
      payload,
    })
  );
  t.false(
    subject.next.calledWith({
      type: 'CREARE_SEEDERS_FOLDER_SKIP_FOLDER_EXISTS',
      payload,
    })
  );
  t.true(
    subject.next.calledWith({
      type: 'CREARE_SEEDERS_FOLDER_SUCCESS',
      payload,
    })
  );
  t.true(mocks.fs.existsSync.calledWith(folderpath));
  t.true(mocks.fs.mkdirSync.calledWith(folderpath));
});

test('Should _createSeedersFolder and skip', async t => {
  const { mocks } = t.context;
  const folderpath = alreadyExistsPath;
  const foldername = alreadyExistsPath.split('/').pop();
  const payload = { folderpath, foldername };
  const config = {
    userSeedersFolderPath: folderpath,
    userSeedersFolderName: foldername,
  };
  const subject = new Subject();
  const context = { subject, config };
  const _createSeedersFolder = Installer.prototype._createSeedersFolder.bind(
    context
  );

  await t.notThrows(_createSeedersFolder());

  t.true(
    subject.next.calledWith({
      type: 'CREARE_SEEDERS_FOLDER_START',
      payload,
    })
  );
  t.true(
    subject.next.calledWith({
      type: 'CREARE_SEEDERS_FOLDER_SKIP_FOLDER_EXISTS',
      payload,
    })
  );
  t.false(
    subject.next.calledWith({
      type: 'CREARE_SEEDERS_FOLDER_SUCCESS',
      payload,
    })
  );
  t.true(mocks.fs.existsSync.calledWith(folderpath));
  t.false(mocks.fs.mkdirSync.calledWith(folderpath));
});

test('Should _createSeedersFolder and fail', async t => {
  const { mocks } = t.context;
  const folderpath = throwableMkdirPath;
  const foldername = throwableMkdirPath.split('/').pop();
  const payload = { folderpath, foldername };
  const config = {
    userSeedersFolderPath: folderpath,
    userSeedersFolderName: foldername,
  };
  const subject = new Subject();
  const context = { subject, config };
  const _createSeedersFolder = Installer.prototype._createSeedersFolder.bind(
    context
  );

  const rejectionError = await t.throws(_createSeedersFolder());

  t.is(rejectionError.type, 'CREARE_SEEDERS_FOLDER_ERROR');
  t.deepEqual(rejectionError.payload, {
    ...payload,
    error: new Error('some-error'),
  });
  t.true(
    subject.next.calledWith({
      type: 'CREARE_SEEDERS_FOLDER_START',
      payload,
    })
  );
  t.false(
    subject.next.calledWith({
      type: 'CREARE_SEEDERS_FOLDER_SKIP_FOLDER_EXISTS',
      payload,
    })
  );
  t.false(
    subject.next.calledWith({
      type: 'CREARE_SEEDERS_FOLDER_SUCCESS',
      payload,
    })
  );
  t.true(mocks.fs.existsSync.calledWith(folderpath));
  t.true(mocks.fs.mkdirSync.calledWith(folderpath));
});

test('Should _writeUserConfig and success', async t => {
  const config = {
    userConfigExists: false,
    userConfigFilename: 'filename.js',
    userConfigFilepath: '/some/path/filename.js',
    configTemplatePath: '/some/template.js',
  };
  const payload = {
    fileExists: config.userConfigExists,
    filename: config.userConfigFilename,
    filepath: config.userConfigFilepath,
  };
  const subject = new Subject();
  const context = {
    subject,
    config,
    _commitMemFsChanges: sinon.stub().resolves(),
    memFsEditor: { copy: sinon.stub() },
  };
  const _writeUserConfig = Installer.prototype._writeUserConfig.bind(context);

  await t.notThrows(_writeUserConfig());

  t.true(
    subject.next.calledWith({
      type: 'WRITE_USER_CONFIG_START',
      payload,
    })
  );
  t.false(
    subject.next.calledWith({
      type: 'WRITE_USER_CONFIG_SKIP_FILE_EXISTS',
      payload,
    })
  );
  t.true(
    subject.next.calledWith({
      type: 'WRITE_USER_CONFIG_SUCCESS',
      payload,
    })
  );
  t.true(
    context.memFsEditor.copy.calledWith(
      config.configTemplatePath,
      config.userConfigFilepath
    )
  );
  t.true(context._commitMemFsChanges.called);
});

test('Should _writeUserConfig and skip', async t => {
  const config = {
    userConfigExists: true,
    userConfigFilename: 'filename.js',
    userConfigFilepath: '/some/path/filename.js',
    configTemplatePath: '/some/template.js',
  };
  const payload = {
    fileExists: config.userConfigExists,
    filename: config.userConfigFilename,
    filepath: config.userConfigFilepath,
  };
  const subject = new Subject();
  const context = {
    subject,
    config,
    _commitMemFsChanges: sinon.stub().resolves(),
    memFsEditor: { copy: sinon.stub() },
  };
  const _writeUserConfig = Installer.prototype._writeUserConfig.bind(context);

  await t.notThrows(_writeUserConfig());

  t.true(
    subject.next.calledWith({
      type: 'WRITE_USER_CONFIG_START',
      payload,
    })
  );
  t.true(
    subject.next.calledWith({
      type: 'WRITE_USER_CONFIG_SKIP_FILE_EXISTS',
      payload,
    })
  );
  t.false(
    subject.next.calledWith({
      type: 'WRITE_USER_CONFIG_SUCCESS',
      payload,
    })
  );
  t.false(context.memFsEditor.copy.called);
  t.false(context._commitMemFsChanges.called);
});

test('Should _writeUserConfig and fail', async t => {
  const config = {
    userConfigExists: false,
    userConfigFilename: 'filename.js',
    userConfigFilepath: '/some/path/filename.js',
    configTemplatePath: '/some/template.js',
  };
  const payload = {
    fileExists: config.userConfigExists,
    filename: config.userConfigFilename,
    filepath: config.userConfigFilepath,
  };
  const subject = new Subject();
  const error = new Error('some-error');
  const context = {
    subject,
    config,
    _commitMemFsChanges: sinon.stub().rejects(error),
    memFsEditor: { copy: sinon.stub() },
  };
  const _writeUserConfig = Installer.prototype._writeUserConfig.bind(context);

  const rejectionError = await t.throws(_writeUserConfig());

  t.is(rejectionError.type, 'WRITE_USER_CONFIG_ERROR');
  t.deepEqual(rejectionError.payload, { ...payload, error });
  t.true(
    subject.next.calledWith({
      type: 'WRITE_USER_CONFIG_START',
      payload,
    })
  );
  t.false(
    subject.next.calledWith({
      type: 'WRITE_USER_CONFIG_SKIP_FILE_EXISTS',
      payload,
    })
  );
  t.false(
    subject.next.calledWith({
      type: 'WRITE_USER_CONFIG_SUCCESS',
      payload,
    })
  );
  t.true(
    context.memFsEditor.copy.calledWith(
      config.configTemplatePath,
      config.userConfigFilepath
    )
  );
  t.true(context._commitMemFsChanges.called);
});
