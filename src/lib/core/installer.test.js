import test from 'ava';
import sinon from 'sinon';
import path from 'path';

import Subject from '../../__mocks__/rxjs-subject';
import fs, {
  alreadyExistsFilename,
  alreadyExistsPath,
  throwableMkdirPath,
} from '../../__mocks__/fs';
import memFs, { store } from '../../__mocks__/mem-fs';
import memFsEditor, {
  fs as memFsEditorFs,
} from '../../__mocks__/mem-fs-editor';

import { defaultUserGeneratorConfig, systemSeederTemplate } from '../constants';
import { mockImports, resetImports } from '../utils/test-helpers';

import InstallerError from './installer-error';

import Installer, { __RewireAPI__ as moduleRewireAPI } from './installer';

const helpData = {
  seedersFolder: 'seeders-folder',
  customSeederTemplate: 'some-template.js',
};

const defaultConfig = {
  projectRoot: '/project/root',
  userConfigExists: true,
  userConfigFilename: 'config-filename.js',
  userConfigFilepath: '/project/root/config-filename.js',
  configTemplate: '/template/folder/config-template.js',
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

test.afterEach.always('unmock imports', t => {
  const imports = Object.keys(t.context.mocks);

  resetImports({ moduleRewireAPI, imports });
});

test('Should create a installer instance', t => {
  sinon.stub(Installer.prototype, '_initConfig');
  sinon.stub(Installer.prototype, '_initMemFs');

  const installer = new Installer();

  t.truthy(installer._subject);
  t.is(typeof installer.install, 'function');
  t.true(
    installer._initConfig.calledWith({
      ...defaultUserGeneratorConfig,
      customSeederTemplate: undefined,
    })
  );
  t.true(installer._initMemFs.called);

  Installer.prototype._initConfig.restore();
  Installer.prototype._initMemFs.restore();
});

test('Should create a installer instance with args', t => {
  sinon.stub(Installer.prototype, '_initConfig');
  sinon.stub(Installer.prototype, '_initMemFs');

  const installer = new Installer({ ...helpData });

  t.truthy(installer._subject);
  t.is(typeof installer.install, 'function');
  t.true(installer._initConfig.calledWith({ ...helpData }));
  t.true(installer._initMemFs.called);

  Installer.prototype._initConfig.restore();
  Installer.prototype._initMemFs.restore();
});

test('Should _initConfig', t => {
  const context = {};
  const _initConfig = Installer.prototype._initConfig.bind(context);

  _initConfig({ ...helpData });

  t.snapshot(context);
});

test('Should _initConfig without customSeederTemplate', t => {
  const context = {};
  const _initConfig = Installer.prototype._initConfig.bind(context);

  const config = { ...helpData };
  delete config.customSeederTemplate;

  _initConfig(config);

  t.snapshot(context);
});

test('Should _initMemFs', t => {
  const { mocks } = t.context;

  const context = {};
  const _initMemFs = Installer.prototype._initMemFs.bind(context);

  _initMemFs();

  t.true(mocks.memFs.create.called);
  t.true(mocks.editor.create.calledWith(store));
  t.is(context._memFsEditor, memFsEditorFs);
});

test('Should install', t => {
  const context = {
    _install: sinon.stub().resolves(),
    _subject: { asObservable: () => 'observable' },
  };
  const install = Installer.prototype.install.bind(context);

  const results = install();

  t.is(results, 'observable');
  t.true(context._install.called);
});

test('Should getGeneratorConfig', t => {
  const context = {
    config: {
      userSeedersFolderName: 'foldername',
    },
  };
  const getGeneratorConfig = Installer.prototype.getGeneratorConfig.bind(
    context
  );

  const expectedResults = {
    seedersFolder: context.config.userSeedersFolderName,
  };
  const results = getGeneratorConfig();

  t.deepEqual(results, expectedResults);
});

test('Should getGeneratorConfig with customSeederTemplate', t => {
  const context = {
    config: {
      userSeedersFolderName: 'foldername',
      customSeederTemplateFilename: 'template-filename.js',
    },
  };
  const getGeneratorConfig = Installer.prototype.getGeneratorConfig.bind(
    context
  );

  const expectedResults = {
    seedersFolder: context.config.userSeedersFolderName,
    customSeederTemplate: context.config.customSeederTemplateFilename,
  };
  const results = getGeneratorConfig();

  t.deepEqual(results, expectedResults);
});

test('Should _install and success', async t => {
  const context = {
    _createCustomSeederTemplate: sinon.stub().resolves(),
    _writeUserGeneratorConfigToPackageJson: sinon.stub().resolves(),
    _createSeedersFolder: sinon.stub().resolves(),
    _writeUserConfig: sinon.stub().resolves(),
    _subject: {
      next: sinon.stub(),
      complete: sinon.stub(),
      error: sinon.stub(),
    },
  };
  const _install = Installer.prototype._install.bind(context);

  await _install();

  t.true(context._createCustomSeederTemplate.called);
  t.true(context._writeUserGeneratorConfigToPackageJson.called);
  t.true(context._createSeedersFolder.called);
  t.true(context._writeUserConfig.called);
  t.true(context._subject.next.calledWith({ type: 'START' }));
  t.true(context._subject.next.calledWith({ type: 'SUCCESS' }));
  t.true(context._subject.complete.called);
  t.false(context._subject.error.called);
});

test('Should _install and fail', async t => {
  const error = new Error('some-error');
  const context = {
    _createCustomSeederTemplate: sinon.stub().resolves(),
    _writeUserGeneratorConfigToPackageJson: sinon.stub().resolves(),
    _createSeedersFolder: sinon.stub().rejects(error),
    _writeUserConfig: sinon.stub().resolves(),
    _subject: {
      next: sinon.stub(),
      complete: sinon.stub(),
      error: sinon.stub(),
    },
  };
  const _install = Installer.prototype._install.bind(context);

  await t.notThrowsAsync(() => _install());

  t.true(context._createCustomSeederTemplate.called);
  t.true(context._writeUserGeneratorConfigToPackageJson.called);
  t.true(context._createSeedersFolder.called);
  t.false(context._writeUserConfig.called);
  t.true(context._subject.next.calledWith({ type: 'START' }));
  t.false(context._subject.next.calledWith({ type: 'SUCCESS' }));
  t.false(context._subject.complete.called);
  t.true(
    context._subject.error.calledWith({ type: 'ERROR', payload: { error } })
  );
});

test('Should _install and fail with InstallerError', async t => {
  const type = 'CREATE_SEEDERS_FOLDER_ERROR';
  const payload = { some: 'data' };
  const baseError = new Error('some-base-error');

  const error = new InstallerError({ type, payload, error: baseError });
  const context = {
    _createCustomSeederTemplate: sinon.stub().resolves(),
    _writeUserGeneratorConfigToPackageJson: sinon.stub().resolves(),
    _createSeedersFolder: sinon.stub().rejects(error),
    _writeUserConfig: sinon.stub().resolves(),
    _subject: {
      next: sinon.stub(),
      complete: sinon.stub(),
      error: sinon.stub(),
    },
  };
  const _install = Installer.prototype._install.bind(context);

  await _install();

  t.true(context._createCustomSeederTemplate.called);
  t.true(context._writeUserGeneratorConfigToPackageJson.called);
  t.true(context._createSeedersFolder.called);
  t.false(context._writeUserConfig.called);
  t.true(context._subject.next.calledWith({ type: 'START' }));
  t.false(context._subject.next.calledWith({ type: 'SUCCESS' }));
  t.false(context._subject.complete.called);
  t.true(
    context._subject.error.calledWith({
      type,
      payload: { ...payload, error: baseError },
    })
  );
});

test('Should _commitMemFsChanges', async t => {
  const context = {
    _memFsEditor: { commit: sinon.stub().callsArg(0) },
  };
  const _commitMemFsChanges = Installer.prototype._commitMemFsChanges.bind(
    context
  );

  await _commitMemFsChanges();

  t.true(context._memFsEditor.commit.called);
});

test('Should _createCustomSeederTemplate and success', async t => {
  const customSeederTemplateFilename = 'seeder-template.js';
  const customSeederTemplatePath = `/some/${customSeederTemplateFilename}`;
  const config = { customSeederTemplateFilename, customSeederTemplatePath };
  const payload = { customSeederTemplateFilename, customSeederTemplatePath };

  const subject = new Subject();
  const context = {
    _subject: subject,
    config,
    _commitMemFsChanges: sinon.stub().resolves(),
    _memFsEditor: { copy: sinon.stub() },
  };
  const _createCustomSeederTemplate = Installer.prototype._createCustomSeederTemplate.bind(
    context
  );

  await t.notThrowsAsync(() => _createCustomSeederTemplate());

  t.true(
    subject.next.calledWith({
      type: 'CREATE_CUSTOM_SEEDER_TEMPLATE_FILE_START',
      payload,
    })
  );
  t.false(
    subject.next.calledWith({
      type: 'CREATE_CUSTOM_SEEDER_TEMPLATE_FILE_SKIP_NO_CUSTOM',
      payload,
    })
  );
  t.false(
    subject.next.calledWith({
      type: 'CREATE_CUSTOM_SEEDER_TEMPLATE_FILE_SKIP_FILE_EXISTS',
      payload,
    })
  );
  t.true(
    subject.next.calledWith({
      type: 'CREATE_CUSTOM_SEEDER_TEMPLATE_FILE_SUCCESS',
      payload,
    })
  );
  t.true(
    context._memFsEditor.copy.calledWith(
      systemSeederTemplate,
      customSeederTemplatePath
    )
  );
  t.true(context._commitMemFsChanges.called);
});

test('Should _createCustomSeederTemplate and skip because no custom seeder choosed', async t => {
  const customSeederTemplateFilename = undefined;
  const customSeederTemplatePath = undefined;
  const config = { customSeederTemplateFilename, customSeederTemplatePath };
  const payload = { customSeederTemplateFilename, customSeederTemplatePath };

  const subject = new Subject();
  const context = {
    _subject: subject,
    config,
    _commitMemFsChanges: sinon.stub().resolves(),
    _memFsEditor: { copy: sinon.stub() },
  };
  const _createCustomSeederTemplate = Installer.prototype._createCustomSeederTemplate.bind(
    context
  );

  await t.notThrows(() => _createCustomSeederTemplate());

  t.true(
    subject.next.calledWith({
      type: 'CREATE_CUSTOM_SEEDER_TEMPLATE_FILE_START',
      payload,
    })
  );
  t.true(
    subject.next.calledWith({
      type: 'CREATE_CUSTOM_SEEDER_TEMPLATE_FILE_SKIP_NO_CUSTOM',
      payload,
    })
  );
  t.false(
    subject.next.calledWith({
      type: 'CREATE_CUSTOM_SEEDER_TEMPLATE_FILE_SKIP_FILE_EXISTS',
      payload,
    })
  );
  t.false(
    subject.next.calledWith({
      type: 'CREATE_CUSTOM_SEEDER_TEMPLATE_FILE_SUCCESS',
      payload,
    })
  );
  t.false(context._memFsEditor.copy.called);
  t.false(context._commitMemFsChanges.called);
});

test('Should _createCustomSeederTemplate and skip because no the seeder template already exists', async t => {
  const customSeederTemplateFilename = alreadyExistsFilename;
  const customSeederTemplatePath = alreadyExistsPath;
  const config = { customSeederTemplateFilename, customSeederTemplatePath };
  const payload = { customSeederTemplateFilename, customSeederTemplatePath };

  const subject = new Subject();
  const context = {
    _subject: subject,
    config,
    _commitMemFsChanges: sinon.stub().resolves(),
    _memFsEditor: { copy: sinon.stub() },
  };
  const _createCustomSeederTemplate = Installer.prototype._createCustomSeederTemplate.bind(
    context
  );

  await t.notThrows(() => _createCustomSeederTemplate());

  t.true(
    subject.next.calledWith({
      type: 'CREATE_CUSTOM_SEEDER_TEMPLATE_FILE_START',
      payload,
    })
  );
  t.false(
    subject.next.calledWith({
      type: 'CREATE_CUSTOM_SEEDER_TEMPLATE_FILE_SKIP_NO_CUSTOM',
      payload,
    })
  );
  t.true(
    subject.next.calledWith({
      type: 'CREATE_CUSTOM_SEEDER_TEMPLATE_FILE_SKIP_FILE_EXISTS',
      payload,
    })
  );
  t.false(
    subject.next.calledWith({
      type: 'CREATE_CUSTOM_SEEDER_TEMPLATE_FILE_SUCCESS',
      payload,
    })
  );
  t.false(context._memFsEditor.copy.called);
  t.false(context._commitMemFsChanges.called);
});

test('Should _createCustomSeederTemplate and fail', async t => {
  const customSeederTemplateFilename = 'seeder-template.js';
  const customSeederTemplatePath = `/some/${customSeederTemplateFilename}`;
  const config = { customSeederTemplateFilename, customSeederTemplatePath };
  const payload = { customSeederTemplateFilename, customSeederTemplatePath };

  const subject = new Subject();
  const error = new Error('some-error');
  const context = {
    _subject: subject,
    config,
    _commitMemFsChanges: sinon.stub().rejects(error),
    _memFsEditor: { copy: sinon.stub() },
  };
  const _createCustomSeederTemplate = Installer.prototype._createCustomSeederTemplate.bind(
    context
  );

  const rejectionError = await t.throwsAsync(() =>
    _createCustomSeederTemplate()
  );

  t.is(rejectionError.type, 'CREATE_CUSTOM_SEEDER_TEMPLATE_FILE_ERROR');
  t.deepEqual(rejectionError.payload, { ...payload, error });
  t.true(
    subject.next.calledWith({
      type: 'CREATE_CUSTOM_SEEDER_TEMPLATE_FILE_START',
      payload,
    })
  );
  t.false(
    subject.next.calledWith({
      type: 'CREATE_CUSTOM_SEEDER_TEMPLATE_FILE_SKIP_NO_CUSTOM',
      payload,
    })
  );
  t.false(
    subject.next.calledWith({
      type: 'CREATE_CUSTOM_SEEDER_TEMPLATE_FILE_SKIP_FILE_EXISTS',
      payload,
    })
  );
  t.false(
    subject.next.calledWith({
      type: 'CREATE_CUSTOM_SEEDER_TEMPLATE_FILE_SUCCESS',
      payload,
    })
  );
  t.true(context._memFsEditor.copy.called);
  t.true(context._commitMemFsChanges.called);
});

test('Should _writeUserGeneratorConfigToPackageJson and success', async t => {
  const config = {
    userPackageJsonPath: path.join(__dirname, './__mocks__/package.json'),
  };
  const generatorConfig = {
    seedersFolder: '/some/folder',
    customSeederTemplateFilename: 'some-filename.js',
  };
  const payload = {
    packageJsonPath: config.userPackageJsonPath,
  };
  const subject = new Subject();
  const context = {
    _subject: subject,
    config,
    _commitMemFsChanges: sinon.stub().resolves(),
    _memFsEditor: { writeJSON: sinon.stub() },
    getGeneratorConfig: () => generatorConfig,
  };
  const _writeUserGeneratorConfigToPackageJson = Installer.prototype._writeUserGeneratorConfigToPackageJson.bind(
    context
  );

  await t.notThrowsAsync(() => _writeUserGeneratorConfigToPackageJson());

  t.true(
    subject.next.calledWith({
      type: 'WRITE_USER_GENERETOR_CONFIG_START',
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
    context._memFsEditor.writeJSON.calledWith(payload.packageJsonPath, {
      mdSeed: generatorConfig,
    })
  );
  t.true(context._commitMemFsChanges.called);
});

test('Should _writeUserGeneratorConfigToPackageJson and fail', async t => {
  const config = {
    userPackageJsonPath: path.join(__dirname, './__mocks__/package.json'),
  };
  const generatorConfig = {
    seedersFolder: '/some/folder',
    customSeederTemplateFilename: 'some-filename.js',
  };
  const payload = {
    packageJsonPath: config.userPackageJsonPath,
  };
  const subject = new Subject();
  const error = new Error('some-error');
  const context = {
    _subject: subject,
    config,
    _commitMemFsChanges: sinon.stub().rejects(error),
    _memFsEditor: { writeJSON: sinon.stub() },
    getGeneratorConfig: () => generatorConfig,
  };
  const _writeUserGeneratorConfigToPackageJson = Installer.prototype._writeUserGeneratorConfigToPackageJson.bind(
    context
  );

  const rejectionError = await t.throwsAsync(
    _writeUserGeneratorConfigToPackageJson()
  );

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
      type: 'WRITE_USER_GENERETOR_CONFIG_SUCCESS',
      payload,
    })
  );
  t.true(context._memFsEditor.writeJSON.called);
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
  const context = { _subject: subject, config };
  const _createSeedersFolder = Installer.prototype._createSeedersFolder.bind(
    context
  );

  await t.notThrows(() => _createSeedersFolder());

  t.true(
    subject.next.calledWith({
      type: 'CREATE_SEEDERS_FOLDER_START',
      payload,
    })
  );
  t.false(
    subject.next.calledWith({
      type: 'CREATE_SEEDERS_FOLDER_SKIP_FOLDER_EXISTS',
      payload,
    })
  );
  t.true(
    subject.next.calledWith({
      type: 'CREATE_SEEDERS_FOLDER_SUCCESS',
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
  const context = { _subject: subject, config };
  const _createSeedersFolder = Installer.prototype._createSeedersFolder.bind(
    context
  );

  await t.notThrows(() => _createSeedersFolder());

  t.true(
    subject.next.calledWith({
      type: 'CREATE_SEEDERS_FOLDER_START',
      payload,
    })
  );
  t.true(
    subject.next.calledWith({
      type: 'CREATE_SEEDERS_FOLDER_SKIP_FOLDER_EXISTS',
      payload,
    })
  );
  t.false(
    subject.next.calledWith({
      type: 'CREATE_SEEDERS_FOLDER_SUCCESS',
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
  const context = { _subject: subject, config };
  const _createSeedersFolder = Installer.prototype._createSeedersFolder.bind(
    context
  );

  const rejectionError = await t.throwsAsync(() => _createSeedersFolder());

  t.is(rejectionError.type, 'CREATE_SEEDERS_FOLDER_ERROR');
  t.deepEqual(rejectionError.payload, {
    ...payload,
    error: new Error('some-error'),
  });
  t.true(
    subject.next.calledWith({
      type: 'CREATE_SEEDERS_FOLDER_START',
      payload,
    })
  );
  t.false(
    subject.next.calledWith({
      type: 'CREATE_SEEDERS_FOLDER_SKIP_FOLDER_EXISTS',
      payload,
    })
  );
  t.false(
    subject.next.calledWith({
      type: 'CREATE_SEEDERS_FOLDER_SUCCESS',
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
    _subject: subject,
    config,
    _commitMemFsChanges: sinon.stub().resolves(),
    _memFsEditor: { copy: sinon.stub() },
  };
  const _writeUserConfig = Installer.prototype._writeUserConfig.bind(context);

  await t.notThrowsAsync(() => _writeUserConfig());

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
    context._memFsEditor.copy.calledWith(
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
    _subject: subject,
    config,
    _commitMemFsChanges: sinon.stub().resolves(),
    _memFsEditor: { copy: sinon.stub() },
  };
  const _writeUserConfig = Installer.prototype._writeUserConfig.bind(context);

  await t.notThrows(() => _writeUserConfig());

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
  t.false(context._memFsEditor.copy.called);
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
    _subject: subject,
    config,
    _commitMemFsChanges: sinon.stub().rejects(error),
    _memFsEditor: { copy: sinon.stub() },
  };
  const _writeUserConfig = Installer.prototype._writeUserConfig.bind(context);

  const rejectionError = await t.throwsAsync(() => _writeUserConfig());

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
    context._memFsEditor.copy.calledWith(
      config.configTemplatePath,
      config.userConfigFilepath
    )
  );
  t.true(context._commitMemFsChanges.called);
});
