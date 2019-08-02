import test from 'ava';
import sinon from 'sinon';

import Installer from '../../core/__mocks__/installer';

import runInstaller, {
  __RewireAPI__ as moduleRewireAPI,
} from './run-installer';

import InstallerLogger from './__mocks__/installer-logger';

const testInstaller = async (t, options) => {
  const { Installer, promptMissingOptions } = t.context.mocks;

  const seedersFolder =
    (options && options.seedersFolder) || 'some-seeder-folder';

  const customSeederTemplate =
    (options && options.customSeederTemplate) || 'some-file-path.js';

  promptMissingOptions.resolves({ seedersFolder, customSeederTemplate });

  await runInstaller(options);

  t.true(promptMissingOptions.calledWith(options || {}));
  t.true(Installer.calledWith({ seedersFolder, customSeederTemplate }));
  t.true(Installer.prototype.install.called);
  t.true(
    Installer.stubbedOvservable.subscribe.calledWith(
      InstallerLogger.stubbedOvserver
    )
  );
  t.true(Installer.stubbedOvservable.toPromise.called);

  t.true(InstallerLogger.called);
  t.true(InstallerLogger.prototype.asObserver.called);
};

test.beforeEach('mock imports', t => {
  const mocks = {
    InstallerLogger,
    Installer,
    promptMissingOptions: sinon.stub(),
  };

  t.context = { mocks };

  for (const [name, mock] of Object.entries(mocks)) {
    moduleRewireAPI.__Rewire__(name, mock);
  }
});

test.afterEach.always('unmock imports', t => {
  for (const name of Object.keys(t.context.mocks)) {
    moduleRewireAPI.__ResetDependency__(name);
  }
});

test.serial('should run installer', t => testInstaller(t));

test.serial('should run installer with options', t =>
  testInstaller(t, {
    seedersFolder: 'some-seeders-folder',
    customSeederTemplate: 'some-file-path.js',
  })
);
