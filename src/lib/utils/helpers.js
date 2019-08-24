import { trim, upperFirst, camelCase, kebabCase } from 'lodash';

import config from '../config';
import { ExitCodes } from './constants';

/**
 * Normalize seeder name.
 * @param  {string} name seeder name
 * @return {string}      normalized seeder name
 */
export const normalizeSeederName = name => upperFirst(camelCase(name));
/**
 * Normalize seeder filename.
 * @param  {string} name seeder name
 * @return {string}      normalized seeder filename
 */
export const normalizeSeederFileName = name => `${kebabCase(name)}.seeder.js`;
/**
 * Get folder name from given path.
 * @param  {string} path path
 * @return {string}      folder name
 */
export const getFolderNameFromPath = path =>
  path.substring(path.lastIndexOf('/') + 1);
/**
 * Get object with selected keys from a given object.
 * @param  {Object}   obj  Object
 * @param  {string[]} keys Keys to get from the given object.
 * @return {Object} new object with the selected keys.
 */
export const getObjectWithSelectedKeys = (obj, keys) => {
  const newObj = {};

  Object.keys(obj).forEach(k => {
    if (keys.includes(k)) {
      newObj[k] = obj[k];
    }
  });

  return newObj;
};
/**
 * Validate seeders folder name.
 * @param  {string} name folder name
 * @return {boolean}
 */
export const validateSeedersFolderName = name =>
  typeof name === 'string' && trim(name).length >= 3;
/**
 * Validate seeder template path.
 * @param  {string} name path
 * @return {boolean}
 */
export const validateSeederTemplatePath = name =>
  typeof name === 'string' && trim(name).length >= 6;
/**
 * Validate user config.
 * @throws {Error} throw error when user config is not valid.
 */
export const validateUserConfig = () => {
  const { userConfigExists } = config;

  if (!userConfigExists) {
    throw new Error(
      'Must contain md-seed-config.js at the project root. run `md-seed init` to create the config file.'
    );
  }
};
/**
 * Exit mongoose-data-seed.
 * @param  {Error} [error] Exit with error when supplied.
 */
export const exit = error => {
  if (error && error.message && error.message !== 'exit') {
    console.error(error);
    process.exit(ExitCodes.Error);
  } else {
    process.exit(ExitCodes.Success);
  }
};
