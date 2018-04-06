import { trim, upperFirst, camelCase, kebabCase } from 'lodash';

import config from '../config';
import { ExitCodes } from './constants';

export const normalizeSeederName = name => upperFirst(camelCase(name));
export const normalizeSeederFileName = name => `${kebabCase(name)}.seeder.js`;

export const getFolderNameFromPath = path =>
  path.substring(path.lastIndexOf('/') + 1);

export const getObjectWithSelectedKeys = (obj, keys) => {
  const newObj = {};

  Object.keys(obj).forEach(k => {
    if (keys.includes(k)) {
      newObj[k] = obj[k];
    }
  });

  return newObj;
};

export const validateSeedersFolderName = name =>
  typeof name === 'string' && trim(name).length >= 3;

export const validateUserConfig = () => {
  const { userConfigExists } = config;

  if (!userConfigExists) {
    throw new Error(
      'Must contain md-seed-config.js at the project root. run `md-seed init` to create the config file.'
    );
  }
};

export const exit = error => {
  if (error && error.message && error.message !== 'exit') {
    console.error(error);
    process.exit(ExitCodes.Error);
  } else {
    process.exit(ExitCodes.Success);
  }
};
