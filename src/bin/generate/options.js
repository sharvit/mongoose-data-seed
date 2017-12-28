import commandLineArgs from 'command-line-args';

export const optionDefinitions = [
  {
    name: 'name',
    alias: 'n',
    type: String,
    defaultOption: true,
    typeLabel: 'name',
    description: 'Seeder name to generate',
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
  const { name: seederName, help: helpWanted } = commandLineArgs(
    optionDefinitions,
    { argv }
  );

  return { seederName, helpWanted };
};

export default getOptions;
