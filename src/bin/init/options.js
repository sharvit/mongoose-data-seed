import commandLineArgs from 'command-line-args';

export const optionDefinitions = [
  {
    name: 'es6',
    type: Boolean,
    description: 'Use es6 syntax, require babel',
  },
  {
    name: 'seedersFolder',
    alias: 'f',
    type: String,
    description: 'Seeders folder name',
  },
  {
    name: 'help',
    alias: 'h',
    type: Boolean,
    defaultValue: false,
    description: 'Show usage guide',
  },
];

export const getOptions = argv => {
  const { es6, seedersFolder, help: helpWanted } = commandLineArgs(
    optionDefinitions,
    { argv }
  );

  return { es6, seedersFolder, helpWanted };
};

export default getOptions;
