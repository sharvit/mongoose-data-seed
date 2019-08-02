import test from 'ava';
import sinon from 'sinon';
import path from 'path';

import SeederGenerator, {
  __RewireAPI__ as moduleRewireAPI,
} from './seeder-generator';

const helperData = {
  name: 'some-name',
  seederName: 'SomeName',
  seederFileName: 'some-name.seeder.js',
  seederFilePath: 'some/path/some-name.seeder.js',
  seederFileRelativePath: 'some/relative-path/some-name.seeder.js',
  seederTemplate: 'some template',
  userSeedersFolderPath: 'some/path/for/seeders',
  userSeedersFolderName: 'some-folder-name',
};

test('should create a new instance of SeederGenerator', t => {
  const createStubs = () => {
    sinon.stub(SeederGenerator.prototype, '_initOptions');
    sinon.stub(SeederGenerator.prototype, '_initMemFs');
    sinon.stub(SeederGenerator.prototype, '_initName');
  };
  const restoreStubs = () => {
    SeederGenerator.prototype._initOptions.restore();
    SeederGenerator.prototype._initMemFs.restore();
    SeederGenerator.prototype._initName.restore();
  };

  createStubs();

  const { name, seederTemplate, userSeedersFolderPath } = helperData;

  const generator = new SeederGenerator({
    name,
    seederTemplate,
    userSeedersFolderPath,
  });

  t.true(
    generator._initOptions.calledWith({
      seederTemplate,
      userSeedersFolderPath,
    })
  );
  t.true(generator._initMemFs.called);
  t.true(generator._initName.calledWith(name));

  restoreStubs();
});

test('should generate Seeder', async t => {
  const { seederFileRelativePath } = helperData;

  const context = {
    seederFileRelativePath,
    _validateSeederFileNotExists: sinon.stub(),
    _copySeederTemplate: sinon.stub(),
    _commitMemFsChanges: sinon.stub().resolves(),
  };

  const result = await SeederGenerator.prototype.generate.call(context);

  t.true(context._validateSeederFileNotExists.called);
  t.true(context._copySeederTemplate.called);
  t.true(context._commitMemFsChanges.called);

  t.is(result, context.seederFileRelativePath);
});

test('should init options', t => {
  const createStubs = ({ getFolderNameFromPath }) => {
    moduleRewireAPI.__Rewire__('getFolderNameFromPath', getFolderNameFromPath);
  };
  const restoreStubs = () => {
    moduleRewireAPI.__ResetDependency__('getFolderNameFromPath');
  };

  const {
    seederTemplate,
    userSeedersFolderPath,
    userSeedersFolderName,
  } = helperData;

  const getFolderNameFromPath = sinon
    .stub()
    .withArgs(userSeedersFolderPath)
    .returns(userSeedersFolderName);

  createStubs({ getFolderNameFromPath });

  const context = {};

  SeederGenerator.prototype._initOptions.call(context, {
    seederTemplate,
    userSeedersFolderPath,
  });

  t.true(getFolderNameFromPath.calledWith(userSeedersFolderPath));
  t.deepEqual(context, {
    options: {
      seederTemplate,
      userSeedersFolderName,
      userSeedersFolderPath,
    },
  });

  restoreStubs();
});

test('should init memFs', t => {
  const createStubs = ({ memFs, editor }) => {
    moduleRewireAPI.__Rewire__('memFs', memFs);
    moduleRewireAPI.__Rewire__('editor', editor);
  };
  const restoreStubs = () => {
    moduleRewireAPI.__ResetDependency__('memFs');
    moduleRewireAPI.__ResetDependency__('editor');
  };

  const store = 'some store';
  const fs = 'some fs';

  const memFs = { create: sinon.stub().returns(store) };
  const editor = {
    create: sinon
      .stub()
      .withArgs(store)
      .returns(fs),
  };

  createStubs({ memFs, editor });

  const context = {};

  SeederGenerator.prototype._initMemFs.call(context);

  t.true(memFs.create.called);
  t.true(editor.create.calledWith(store));
  t.deepEqual(context, { fs });

  restoreStubs();
});

test('should init name', t => {
  const {
    name,
    seederName,
    seederFileName,
    userSeedersFolderPath,
    userSeedersFolderName,
  } = helperData;

  const seederFilePath = path.join(userSeedersFolderPath, seederFileName);
  const seederFileRelativePath = path.join(
    userSeedersFolderName,
    seederFileName
  );

  const context = { options: { userSeedersFolderPath, userSeedersFolderName } };
  const expectedContext = Object.assign({}, context, {
    name,
    seederName,
    seederFileName,
    seederFilePath,
    seederFileRelativePath,
  });

  SeederGenerator.prototype._initName.call(context, name);

  t.deepEqual(context, expectedContext);
});

test('_validateSeederFileNotExists should throw error when seeder file are already exists', t => {
  const { seederFilePath, seederFileRelativePath } = helperData;

  const fs = { exists: () => true };
  const context = { fs, seederFilePath, seederFileRelativePath };

  t.throws(
    () => SeederGenerator.prototype._validateSeederFileNotExists.call(context),
    Error
  );
});

test('_validateSeederFileNotExists should not throw error when seeder file are not exists', t => {
  const { seederFilePath, seederFileRelativePath } = helperData;

  const fs = { exists: () => false };
  const context = { fs, seederFilePath, seederFileRelativePath };

  t.notThrows(() =>
    SeederGenerator.prototype._validateSeederFileNotExists.call(context)
  );
});

test('should commit memFs changes', async t => {
  const fs = { commit: sinon.stub().callsArg(0) };

  const context = { fs };

  await SeederGenerator.prototype._commitMemFsChanges.call(context);

  t.true(fs.commit.called);
});

test('should copy seeder template', async t => {
  const { seederName, seederTemplate, seederFilePath } = helperData;

  const fs = { copyTpl: sinon.spy() };
  const context = {
    fs,
    seederName,
    seederFilePath,
    options: { seederTemplate },
  };

  SeederGenerator.prototype._copySeederTemplate.call(context);

  t.true(fs.copyTpl.calledWith(seederTemplate, seederFilePath, { seederName }));
});
