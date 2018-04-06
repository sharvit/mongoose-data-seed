import fs from 'fs';
import path from 'path';
import findRoot from 'find-root';

const workingDir = process.cwd();
const projectRoot = findRoot(workingDir);

const userGeneratorConfigFilename = 'md-seed-generator.json';
const userGeneratorConfigFilepath = path.join(
  projectRoot,
  userGeneratorConfigFilename
);
const userGeneratorConfigExists = fs.existsSync(userGeneratorConfigFilepath);
const {
  es6: useEs6Generator = true,
  seedersFolder: userSeedersFolderName = 'seeders',
} = userGeneratorConfigExists ? require(userGeneratorConfigFilepath) : {};

const userSeedersFolderPath = path.join(projectRoot, userSeedersFolderName);

const userConfigFilename = 'md-seed-config.js';
const userConfigFilepath = path.join(projectRoot, userConfigFilename);
const userConfigExists = fs.existsSync(userConfigFilepath);

const userConfig = userConfigExists ? require(userConfigFilepath) : null;

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

const config = {
  workingDir,
  projectRoot,
  useEs6Generator,
  userGeneratorConfigFilename,
  userGeneratorConfigFilepath,
  userGeneratorConfigExists,
  userConfigFilename,
  userConfigFilepath,
  userSeedersFolderName,
  userSeedersFolderPath,
  userConfigExists,
  userConfig,
  seederTemplate,
  es6ConfigTemplate,
  es5ConfigTemplate,
};

export default config;
