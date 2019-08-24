import path from 'path';

/**
 * mongoose-data-seed user config filename
 * @type {String}
 */
export const configFilename = 'md-seed-config.js';

/**
 * mongoose-data-seed default user generator-config
 * @type {Object}
 * @property {string} seedersFolder
 */
export const defaultUserGeneratorConfig = {
  seedersFolder: './seeders',
};

/**
 * system seeder template path
 * @type {string}
 */
export const systemSeederTemplate = path.join(
  __dirname,
  '../../templates/seeder.ejs'
);

/**
 * system template for user-config path
 * @type {string}
 */
export const systemConfigTemplate = path.join(
  __dirname,
  '../../templates/md-seed-config.ejs'
);
