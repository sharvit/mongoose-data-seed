import fs from 'fs';
import path from 'path';
import findRoot from 'find-root';

const getProjectRoot = () => {
  const workingDir = process.cwd();
  return findRoot(workingDir);
};

const config = {
  clean() {
    delete this.workingDir;
    delete this.projectRoot;
    delete this.useEs6Generator;
    delete this.userGeneratorConfigFilename;
    delete this.userGeneratorConfigFilepath;
    delete this.userGeneratorConfigExists;
    delete this.userConfigFilename;
    delete this.userConfigFilepath;
    delete this.userSeedersFolderName;
    delete this.userSeedersFolderPath;
    delete this.userConfigExists;
    delete this.userConfig;
    delete this.seederTemplate;
    delete this.es6ConfigTemplate;
    delete this.es5ConfigTemplate;
  },

  update(projectRoot = getProjectRoot()) {
    const userGeneratorConfigFilename = 'md-seed-generator.json';
    const userGeneratorConfigFilepath = path.join(
      projectRoot,
      userGeneratorConfigFilename
    );
    const userGeneratorConfigExists = fs.existsSync(
      userGeneratorConfigFilepath
    );
    const {
      es6: useEs6Generator = true,
      seedersFolder: userSeedersFolderName = 'seeders',
    } = userGeneratorConfigExists ? require(userGeneratorConfigFilepath) : {};

    const userSeedersFolderPath = path.join(projectRoot, userSeedersFolderName);

    const userConfigFilename = 'md-seed-config.js';
    const userConfigFilepath = path.join(projectRoot, userConfigFilename);
    const userConfigExists = fs.existsSync(userConfigFilepath);

    const seederTemplate = useEs6Generator
      ? path.join(__dirname, '../../templates/seeder.es6.js')
      : path.join(__dirname, '../../templates/seeder.js');

    const es6ConfigTemplate = path.join(
      __dirname,
      '../../templates/md-seed-config.es6.js'
    );

    const es5ConfigTemplate = path.join(
      __dirname,
      '../../templates/md-seed-config.js'
    );

    this.projectRoot = projectRoot;
    this.useEs6Generator = useEs6Generator;
    this.userGeneratorConfigFilename = userGeneratorConfigFilename;
    this.userGeneratorConfigFilepath = userGeneratorConfigFilepath;
    this.userGeneratorConfigExists = userGeneratorConfigExists;
    this.userConfigFilename = userConfigFilename;
    this.userConfigFilepath = userConfigFilepath;
    this.userSeedersFolderName = userSeedersFolderName;
    this.userSeedersFolderPath = userSeedersFolderPath;
    this.userConfigExists = userConfigExists;
    this.seederTemplate = seederTemplate;
    this.es6ConfigTemplate = es6ConfigTemplate;
    this.es5ConfigTemplate = es5ConfigTemplate;
  },

  loadUserConfig() {
    return require(this.userConfigFilepath);
  },
};

config.update();

export default config;
