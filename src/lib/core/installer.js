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
    WRITE_USER_GENERETOR_CONFIG_SKIP_FILE_EXISTS:
      'WRITE_USER_GENERETOR_CONFIG_SKIP_FILE_EXISTS',

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

  constructor({ es6 = false, seedersFolder = 'seeders' } = {}) {
    this.subject = new Subject();
    this._initConfig({ es6, seedersFolder });
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
    const {
      useEs6Generator: es6,
      userSeedersFolderName: seedersFolder,
    } = this.config;

    return { es6, seedersFolder };
  }

  /*
    Private methods
   */

  /**
   * Initiate this.config
   * @param  {[type]} es6           should use es6 config?
   * @param  {[type]} seedersFolder seeders folder destination
   */
  _initConfig({ es6, seedersFolder }) {
    const configTemplatePath = es6
      ? config.es6ConfigTemplate
      : config.es5ConfigTemplate;

    this.config = {
      useEs6Generator: es6,
      userSeedersFolderName: seedersFolder,
      userSeedersFolderPath: path.join(config.projectRoot, seedersFolder),
      userGeneratorConfigExists: config.userGeneratorConfigExists,
      userGeneratorConfigFilename: config.userGeneratorConfigFilename,
      userGeneratorConfigFilepath: config.userGeneratorConfigFilepath,
      userConfigExists: config.userConfigExists,
      userConfigFilename: config.userConfigFilename,
      userConfigFilepath: config.userConfigFilepath,
      configTemplatePath,
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

      await this._writeUserGeneratorConfig();
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
   * Write the `md-seed-generator.json` into the root folder
   */
  async _writeUserGeneratorConfig() {
    const {
      WRITE_USER_GENERETOR_CONFIG_START,
      WRITE_USER_GENERETOR_CONFIG_SUCCESS,
      WRITE_USER_GENERETOR_CONFIG_ERROR,
      WRITE_USER_GENERETOR_CONFIG_SKIP_FILE_EXISTS,
    } = Installer.operations;

    const {
      userGeneratorConfigExists: fileExists,
      userGeneratorConfigFilename: filename,
      userGeneratorConfigFilepath: filepath,
    } = this.config;

    const payload = { fileExists, filename, filepath };

    try {
      this.subject.next({ type: WRITE_USER_GENERETOR_CONFIG_START, payload });

      if (fileExists) {
        this.subject.next({
          type: WRITE_USER_GENERETOR_CONFIG_SKIP_FILE_EXISTS,
          payload,
        });
      } else {
        this.memFsEditor.writeJSON(filepath, this.getGeneratorConfig());

        await this._commitMemFsChanges();

        this.subject.next({
          type: WRITE_USER_GENERETOR_CONFIG_SUCCESS,
          payload,
        });
      }
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
