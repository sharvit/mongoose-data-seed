import fs from 'fs';
import path from 'path';
import findRoot from 'find-root';

import {
  defaultUserGeneratorConfig,
  systemSeederTemplate,
  systemConfigTemplate,
  configFilename,
} from './constants';

/**
 * Get the user project root path
 * @return {string}
 */
const getProjectRoot = () => {
  const workingDir = process.cwd();
  return findRoot(workingDir);
};

/**
 * mongoose-data-seed config
 * @type {Object}
 * @property {Function} clean
 * @property {Function} getConfigFromPackageJson
 * @property {Function} getUserGeneratorConfig
 * @property {Function} update
 * @property {Function} loadUserConfig
 * @property {String}   projectRoot
 * @property {String}   userConfigFilename
 * @property {String}   userConfigFilepath
 * @property {String}   userSeedersFolderName
 * @property {String}   userSeedersFolderPath
 * @property {boolean}  userConfigExists
 * @property {String}   seederTemplate
 * @property {String}   configTemplate
 */
const config = {
  /**
   * Clean the config
   */
  clean() {
    delete this.workingDir;
    delete this.projectRoot;
    delete this.userConfigFilename;
    delete this.userConfigFilepath;
    delete this.userSeedersFolderName;
    delete this.userSeedersFolderPath;
    delete this.userConfigExists;
    delete this.userConfig;
    delete this.seederTemplate;
    delete this.configTemplate;
  },

  /**
   * Get the user config from the user package.json file
   * @param  {string} [projectRoot=getProjectRoot()] user project root path
   * @return {Object}
   */
  getConfigFromPackageJson(projectRoot = getProjectRoot()) {
    const packageJsonPath = path.join(projectRoot, 'package.json');
    const { mdSeed = {} } = require(packageJsonPath);

    return mdSeed;
  },

  /**
   * Get the user generator config
   * @param  {string} [projectRoot=getProjectRoot()] user project root path
   * @return {Object}
   */
  getUserGeneratorConfig(projectRoot = getProjectRoot()) {
    return {
      ...defaultUserGeneratorConfig,
      ...this.getConfigFromPackageJson(projectRoot),
    };
  },

  /**
   * Update (reload) the config
   * @param  {string} [projectRoot=getProjectRoot()] user project root path
   */
  update(projectRoot = getProjectRoot()) {
    const { seedersFolder, customSeederTemplate } = this.getUserGeneratorConfig(
      projectRoot
    );

    const userSeedersFolderName = seedersFolder;
    const userSeedersFolderPath = path.join(projectRoot, userSeedersFolderName);

    const userConfigFilename = configFilename;
    const userConfigFilepath = path.join(projectRoot, userConfigFilename);
    const userConfigExists = fs.existsSync(userConfigFilepath);

    const configTemplate = systemConfigTemplate;

    const seederTemplate = customSeederTemplate
      ? path.join(projectRoot, customSeederTemplate)
      : systemSeederTemplate;

    this.projectRoot = projectRoot;
    this.userConfigFilename = userConfigFilename;
    this.userConfigFilepath = userConfigFilepath;
    this.userSeedersFolderName = userSeedersFolderName;
    this.userSeedersFolderPath = userSeedersFolderPath;
    this.userConfigExists = userConfigExists;
    this.seederTemplate = seederTemplate;
    this.configTemplate = configTemplate;
  },

  /**
   * Load the user config
   */
  loadUserConfig() {
    return require(this.userConfigFilepath);
  },
};

config.update();

export default config;
