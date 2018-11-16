import fs from 'fs';
import path from 'path';
import findRoot from 'find-root';

import {
  defaultUserGeneratorConfig,
  systemSeederTemplate,
  systemConfigTemplate,
  configFilename,
} from './constants';

const getProjectRoot = () => {
  const workingDir = process.cwd();
  return findRoot(workingDir);
};

const config = {
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

  getConfigFromPackageJson(projectRoot = getProjectRoot()) {
    const packageJsonPath = path.join(projectRoot, 'package.json');
    const { mdSeed = {} } = require(packageJsonPath);

    return mdSeed;
  },

  getUserGeneratorConfig(projectRoot = getProjectRoot()) {
    return {
      ...defaultUserGeneratorConfig,
      ...this.getConfigFromPackageJson(projectRoot),
    };
  },

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

  loadUserConfig() {
    return require(this.userConfigFilepath);
  },
};

config.update();

export default config;
