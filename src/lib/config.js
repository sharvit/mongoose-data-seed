import fs from 'fs';
import path from 'path';
import findRoot from 'find-root';

const workingDir = process.cwd();
const projectRoot = findRoot(workingDir);

const userConfigFilename = 'md-seed-config.js';
const userConfigFilepath = path.join(projectRoot, userConfigFilename);

const userSeedersFolderName = 'seeders';
const userSeedersFolderPath = path.join(projectRoot, userSeedersFolderName);

const userConfigExists = fs.existsSync(userConfigFilepath);

const userConfig = userConfigExists ? require(userConfigFilepath) : null;

const config = {
  workingDir,
  projectRoot,
	userConfigFilename,
	userConfigFilepath,
  userSeedersFolderName,
  userSeedersFolderPath,
  userConfigExists,
  userConfig,
};

export default config;
