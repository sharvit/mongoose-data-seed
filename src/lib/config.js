import fs from 'fs';
import path from 'path';
import findRoot from 'find-root';

const defaultUserGeneratorConfig = {
  seedersFolder: './seeders',
};

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
    const userGeneratorConfig = this.getUserGeneratorConfig(projectRoot);

    const userSeedersFolderName = userGeneratorConfig.seedersFolder;
    const userSeedersFolderPath = path.join(projectRoot, userSeedersFolderName);

    const userConfigFilename = 'md-seed-config.js';
    const userConfigFilepath = path.join(projectRoot, userConfigFilename);
    const userConfigExists = fs.existsSync(userConfigFilepath);

    const seederTemplate = path.join(__dirname, '../../templates/seeder.js');
    const configTemplate = path.join(
      __dirname,
      '../../templates/md-seed-config.js'
    );

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
