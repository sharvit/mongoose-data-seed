import path from 'path';

export const systemSeederTemplate = path.join(
  __dirname,
  '../../templates/seeder.js'
);

export const systemConfigTemplate = path.join(
  __dirname,
  '../../templates/md-seed-config.js'
);

export const configFilename = 'md-seed-config.js';

export const defaultUserGeneratorConfig = {
  seedersFolder: './seeders',
};
