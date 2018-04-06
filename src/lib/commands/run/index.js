import { getOptions } from './options';
import help from './help';
import run from './run';

export default async argv => {
  const { helpWanted, ...options } = getOptions(argv);

  if (helpWanted) return help();

  return run(options);
};
