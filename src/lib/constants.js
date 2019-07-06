import path from 'path';

export const systemSeederTemplate = path.join(
  __dirname,
  '../../templates/seeder.ejs'
);

export const systemConfigTemplate = path.join(
  __dirname,
  '../../templates/md-seed-config.ejs'
);

export const configFilename = 'md-seed-config.js';

export const defaultUserGeneratorConfig = {
  seedersFolder: './seeders',
};
