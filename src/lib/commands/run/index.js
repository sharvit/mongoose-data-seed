import { getOptions } from './options';
import help from './help';
import run from './run';

/**
 * mongoose-data-seed run command
 * @param  {stringp[]}  argv cli arguments
 * @return {Promise}
 */
export default async argv => {
  const { helpWanted, ...options } = getOptions(argv);

  if (helpWanted) return help();

  return run(options);
};
