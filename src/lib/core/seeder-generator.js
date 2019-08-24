import path from 'path';
import memFs from 'mem-fs';
import editor from 'mem-fs-editor';
import chalk from 'chalk';

import {
  getFolderNameFromPath,
  normalizeSeederName,
  normalizeSeederFileName,
} from '../utils/helpers';

/**
 * Seeder Generator
 *
 * Generate a new seeder
 */
export default class SeederGenerator {
  constructor({ name, seederTemplate, userSeedersFolderPath }) {
    this._initOptions({ seederTemplate, userSeedersFolderPath });
    this._initMemFs();
    this._initName(name);
  }

  /**
   * generate the new seeder
   */
  async generate() {
    this._validateSeederFileNotExists();

    this._copySeederTemplate();

    await this._commitMemFsChanges();

    return this.seederFileRelativePath;
  }

  /**
   * Private
   */

  _initOptions({ seederTemplate, userSeedersFolderPath }) {
    const userSeedersFolderName = getFolderNameFromPath(userSeedersFolderPath);

    this.options = {
      seederTemplate,
      userSeedersFolderName,
      userSeedersFolderPath,
    };
  }

  _initMemFs() {
    const store = memFs.create();
    this.fs = editor.create(store);
  }

  _initName(name) {
    const { userSeedersFolderPath, userSeedersFolderName } = this.options;

    // set name
    this.name = name;
    // set seeder-name
    this.seederName = normalizeSeederName(name);
    // set seeder-file-name
    this.seederFileName = normalizeSeederFileName(name);
    // set seeder-file-path
    this.seederFilePath = path.join(userSeedersFolderPath, this.seederFileName);

    // set seeder-file-relative-path
    this.seederFileRelativePath = path.join(
      userSeedersFolderName,
      this.seederFileName
    );
  }

  _validateSeederFileNotExists() {
    if (this.fs.exists(this.seederFilePath)) {
      throw new Error(
        `${chalk.red('ERROR')}
         ${this.seederFileRelativePath} are already exists`
      );
    }
  }

  async _commitMemFsChanges() {
    return new Promise(resolve => {
      this.fs.commit(() => {
        resolve();
      });
    });
  }

  _copySeederTemplate() {
    const { seederName, seederFilePath } = this;
    const { seederTemplate } = this.options;

    const templateArgs = { seederName };

    this.fs.copyTpl(seederTemplate, seederFilePath, templateArgs);
  }
}
