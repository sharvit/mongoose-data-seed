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
};

export default config;
