import fs from 'fs';
import path from 'path';
import memFs from 'mem-fs';
import editor from 'mem-fs-editor';
import chalk from 'chalk';
import { Subject } from 'rxjs/Subject';

import config from '../config';

import InstallerError from './installer-error';

export default class Installer {
  static operations = {
    START: 'START',
    SUCCESS: 'SUCCESS',
    ERROR: 'ERROR',

    WRITE_USER_GENERETOR_CONFIG_START: 'WRITE_USER_GENERETOR_CONFIG_START',
    WRITE_USER_GENERETOR_CONFIG_SUCCESS: 'WRITE_USER_GENERETOR_CONFIG_SUCCESS',
    WRITE_USER_GENERETOR_CONFIG_ERROR: 'WRITE_USER_GENERETOR_CONFIG_ERROR',

    CREARE_SEEDERS_FOLDER_START: 'CREARE_SEEDERS_FOLDER_START',
    CREARE_SEEDERS_FOLDER_SUCCESS: 'CREARE_SEEDERS_FOLDER_SUCCESS',
    CREARE_SEEDERS_FOLDER_ERROR: 'CREARE_SEEDERS_FOLDER_ERROR',
    CREARE_SEEDERS_FOLDER_SKIP_FOLDER_EXISTS:
      'CREARE_SEEDERS_FOLDER_SKIP_FOLDER_EXISTS',

    WRITE_USER_CONFIG_START: 'WRITE_USER_CONFIG_START',
    WRITE_USER_CONFIG_SUCCESS: 'WRITE_USER_CONFIG_SUCCESS',
    WRITE_USER_CONFIG_ERROR: 'WRITE_USER_CONFIG_ERROR',
    WRITE_USER_CONFIG_SKIP_FILE_EXISTS: 'WRITE_USER_CONFIG_SKIP_FILE_EXISTS',
  };

  constructor({ seedersFolder = 'seeders' } = {}) {
    this.subject = new Subject();
    this._initConfig({ seedersFolder });
    this._initMemFs();
  }
  /**
   * Run installer - install `mongoose-data-seeder`
   * @return {Observable}
   */
  install() {
    this._install();

    return this.subject.asObservable();
  }
  /**
   * config to write into `md-seed-config.json`
   */
  getGeneratorConfig() {
    const { userSeedersFolderName: seedersFolder } = this.config;

    return { seedersFolder };
  }

  /*
    Private methods
   */

  /**
   * Initiate this.config
   * @param  {string} seedersFolder seeders folder destination
   */
  _initConfig({ seedersFolder }) {
    this.config = {
      userPackageJsonPath: path.join(config.projectRoot, './package.json'),
      userSeedersFolderName: seedersFolder,
      userSeedersFolderPath: path.join(config.projectRoot, seedersFolder),
      userConfigExists: config.userConfigExists,
      userConfigFilename: config.userConfigFilename,
      userConfigFilepath: config.userConfigFilepath,
      configTemplatePath: config.configTemplate,
    };
  }
  /**
   * Initiate the in-memory file-system
   */
  _initMemFs() {
    const store = memFs.create();
    this.memFsEditor = editor.create(store);
  }
  /**
   * Run the installation process
   * @return {Promise}
   */
  async _install() {
    const { START, SUCCESS, ERROR } = Installer.operations;

    try {
      this.subject.next({ type: START });

      await this._writeUserGeneratorConfigToPackageJson();
      await this._createSeedersFolder();
      await this._writeUserConfig();

      this.subject.next({ type: SUCCESS });

      this.subject.complete();
    } catch (error) {
      const { type = ERROR, payload = { error } } = error;

      this.subject.error({ type, payload });
    }
  }
  /**
   * Commit the in-memory file changes
   * @return {Promise}
   */
  async _commitMemFsChanges() {
    return new Promise(resolve => {
      this.memFsEditor.commit(() => {
        resolve();
      });
    });
  }
  /**
   * Write the config into the user package.json
   */
  async _writeUserGeneratorConfigToPackageJson() {
    const {
      WRITE_USER_GENERETOR_CONFIG_START,
      WRITE_USER_GENERETOR_CONFIG_SUCCESS,
      WRITE_USER_GENERETOR_CONFIG_ERROR,
    } = Installer.operations;

    const { userPackageJsonPath: packageJsonPath } = this.config;

    const payload = { packageJsonPath };

    try {
      this.subject.next({ type: WRITE_USER_GENERETOR_CONFIG_START, payload });

      const packageJson = require(packageJsonPath);
      packageJson.mdSeed = this.getGeneratorConfig();

      this.memFsEditor.writeJSON(packageJsonPath, packageJson);

      await this._commitMemFsChanges();

      this.subject.next({
        type: WRITE_USER_GENERETOR_CONFIG_SUCCESS,
        payload,
      });
    } catch (error) {
      throw new InstallerError({
        type: WRITE_USER_GENERETOR_CONFIG_ERROR,
        payload,
        error,
      });
    }
  }
  /**
   * Create the seeders folder
   */
  async _createSeedersFolder() {
    const {
      CREARE_SEEDERS_FOLDER_START,
      CREARE_SEEDERS_FOLDER_SUCCESS,
      CREARE_SEEDERS_FOLDER_ERROR,
      CREARE_SEEDERS_FOLDER_SKIP_FOLDER_EXISTS,
    } = Installer.operations;

    const {
      userSeedersFolderPath: folderpath,
      userSeedersFolderName: foldername,
    } = this.config;

    const payload = { folderpath, foldername };

    try {
      this.subject.next({ type: CREARE_SEEDERS_FOLDER_START, payload });

      if (fs.existsSync(folderpath)) {
        this.subject.next({
          type: CREARE_SEEDERS_FOLDER_SKIP_FOLDER_EXISTS,
          payload,
        });
      } else {
        fs.mkdirSync(folderpath);

        this.subject.next({ type: CREARE_SEEDERS_FOLDER_SUCCESS, payload });
      }
    } catch (error) {
      throw new InstallerError({
        type: CREARE_SEEDERS_FOLDER_ERROR,
        payload,
        error,
      });
    }
  }
  /**
   * Write the `md-seed-config.js` into the root folder
   */
  async _writeUserConfig() {
    const {
      WRITE_USER_CONFIG_START,
      WRITE_USER_CONFIG_SUCCESS,
      WRITE_USER_CONFIG_ERROR,
      WRITE_USER_CONFIG_SKIP_FILE_EXISTS,
    } = Installer.operations;

    const {
      userConfigExists: fileExists,
      userConfigFilename: filename,
      userConfigFilepath: filepath,
      configTemplatePath,
    } = this.config;

    const payload = { fileExists, filename, filepath };

    try {
      this.subject.next({ type: WRITE_USER_CONFIG_START, payload });

      if (fileExists === true) {
        this.subject.next({
          type: WRITE_USER_CONFIG_SKIP_FILE_EXISTS,
          payload,
        });
      } else {
        // copy template
        this.memFsEditor.copy(configTemplatePath, filepath);
        // commit changes
        await this._commitMemFsChanges();

        this.subject.next({ type: WRITE_USER_CONFIG_SUCCESS, payload });
      }
    } catch (error) {
      throw new InstallerError({
        type: WRITE_USER_CONFIG_ERROR,
        payload,
        error,
      });
    }
  }
}
