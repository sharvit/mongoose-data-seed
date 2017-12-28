import config from '../config';

export default function mustContainUserConfig() {
  const { userConfigExists } = config;

  if (!userConfigExists) {
    throw new Error(
      'Must contain md-seed-config.js at the project root. run `md-seed init` to create the config file.'
    );
  }
}
