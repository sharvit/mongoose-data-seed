import fs from 'fs';
import path from 'path';
import memFs from 'mem-fs';
import editor from 'mem-fs-editor';
import chalk from 'chalk';
import { Subject } from 'rxjs';

import { defaultUserGeneratorConfig, systemSeederTemplate } from '../constants';
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

    CREATE_CUSTOM_SEEDER_TEMPLATE_FILE_START:
      'CREATE_CUSTOM_SEEDER_TEMPLATE_FILE_START',
    CREATE_CUSTOM_SEEDER_TEMPLATE_FILE_SUCCESS:
      'CREATE_CUSTOM_SEEDER_TEMPLATE_FILE_SUCCESS',
    CREATE_CUSTOM_SEEDER_TEMPLATE_FILE_ERROR:
      'CREATE_CUSTOM_SEEDER_TEMPLATE_FILE_ERROR',
    CREATE_CUSTOM_SEEDER_TEMPLATE_FILE_SKIP_FILE_EXISTS:
      'CREATE_CUSTOM_SEEDER_TEMPLATE_FILE_SKIP_FILE_EXISTS',
    CREATE_CUSTOM_SEEDER_TEMPLATE_FILE_SKIP_NO_CUSTOM:
      'CREATE_CUSTOM_SEEDER_TEMPLATE_FILE_SKIP_NO_CUSTOM',

    CREATE_SEEDERS_FOLDER_START: 'CREATE_SEEDERS_FOLDER_START',
    CREATE_SEEDERS_FOLDER_SUCCESS: 'CREATE_SEEDERS_FOLDER_SUCCESS',
    CREATE_SEEDERS_FOLDER_ERROR: 'CREATE_SEEDERS_FOLDER_ERROR',
    CREATE_SEEDERS_FOLDER_SKIP_FOLDER_EXISTS:
      'CREATE_SEEDERS_FOLDER_SKIP_FOLDER_EXISTS',

    WRITE_USER_CONFIG_START: 'WRITE_USER_CONFIG_START',
    WRITE_USER_CONFIG_SUCCESS: 'WRITE_USER_CONFIG_SUCCESS',
    WRITE_USER_CONFIG_ERROR: 'WRITE_USER_CONFIG_ERROR',
    WRITE_USER_CONFIG_SKIP_FILE_EXISTS: 'WRITE_USER_CONFIG_SKIP_FILE_EXISTS',
  };

  /**
   * mongoose-data-seed installer
   * @param {String} seedersFolder              Relative path to your seeders-folder
   * @param {String} customSeederTemplate       Relative path to your seeder-template
   *                                            if you would like to use your own seeders-template
   */
  constructor({
    seedersFolder,
    customSeederTemplate,
  } = defaultUserGeneratorConfig) {
    this.subject = new Subject();
    this._initConfig({ seedersFolder, customSeederTemplate });
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
   * @param {String} seedersFolder              Relative path to your seeders-folder
   * @param {String} customSeederTemplate       Relative path to your seeder-template
   *                                            if you would like to use your own seeders-template
   */
  _initConfig({ seedersFolder, customSeederTemplate }) {
    this.config = {
      userPackageJsonPath: path.join(config.projectRoot, './package.json'),
      customSeederTemplatePath:
        customSeederTemplate &&
        path.join(config.projectRoot, customSeederTemplate),
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

      await this._createCustomSeederTemplate();
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
   * Copy the package seeder-template to the user desired
   * custom-seeder-template path if the user wants to use his own seeder-template
   * @return {Promise} [description]
   */
  async _createCustomSeederTemplate() {
    const {
      CREATE_CUSTOM_SEEDER_TEMPLATE_FILE_START,
      CREATE_CUSTOM_SEEDER_TEMPLATE_FILE_SUCCESS,
      CREATE_CUSTOM_SEEDER_TEMPLATE_FILE_ERROR,
      CREATE_CUSTOM_SEEDER_TEMPLATE_FILE_SKIP_FILE_EXISTS,
      CREATE_CUSTOM_SEEDER_TEMPLATE_FILE_SKIP_NO_CUSTOM,
    } = Installer.operations;

    const { customSeederTemplatePath } = this.config;

    const payload = { customSeederTemplatePath };

    const notify = type => this.subject.next({ type, payload });

    try {
      notify(CREATE_CUSTOM_SEEDER_TEMPLATE_FILE_START);

      if (!customSeederTemplatePath) {
        return notify(CREATE_CUSTOM_SEEDER_TEMPLATE_FILE_SKIP_NO_CUSTOM);
      }

      if (fs.existsSync(customSeederTemplatePath)) {
        notify(CREATE_CUSTOM_SEEDER_TEMPLATE_FILE_SKIP_FILE_EXISTS);
      } else {
        // copy template
        this.memFsEditor.copy(systemSeederTemplate, customSeederTemplatePath);
        // commit changes
        await this._commitMemFsChanges();

        notify(CREATE_CUSTOM_SEEDER_TEMPLATE_FILE_SUCCESS);
      }
    } catch (error) {
      throw new InstallerError({
        type: CREATE_CUSTOM_SEEDER_TEMPLATE_FILE_ERROR,
        payload,
        error,
      });
    }
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
      CREATE_SEEDERS_FOLDER_START,
      CREATE_SEEDERS_FOLDER_SUCCESS,
      CREATE_SEEDERS_FOLDER_ERROR,
      CREATE_SEEDERS_FOLDER_SKIP_FOLDER_EXISTS,
    } = Installer.operations;

    const {
      userSeedersFolderPath: folderpath,
      userSeedersFolderName: foldername,
    } = this.config;

    const payload = { folderpath, foldername };

    try {
      this.subject.next({ type: CREATE_SEEDERS_FOLDER_START, payload });

      if (fs.existsSync(folderpath)) {
        this.subject.next({
          type: CREATE_SEEDERS_FOLDER_SKIP_FOLDER_EXISTS,
          payload,
        });
      } else {
        fs.mkdirSync(folderpath);

        this.subject.next({ type: CREATE_SEEDERS_FOLDER_SUCCESS, payload });
      }
    } catch (error) {
      throw new InstallerError({
        type: CREATE_SEEDERS_FOLDER_ERROR,
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
