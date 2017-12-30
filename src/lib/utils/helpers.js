import config from '../config';

export const getObjectWithSelectedKeys = (obj, keys) => {
  const newObj = {};

  Object.keys(obj).forEach(k => {
    if (keys.includes(k)) {
      newObj[k] = obj[k];
    }
  });

  return newObj;
};

export const mustContainUserConfig = () => {
  const { userConfigExists } = config;

  if (!userConfigExists) {
    throw new Error(
      'Must contain md-seed-config.js at the project root. run `md-seed init` to create the config file.'
    );
  }
};
