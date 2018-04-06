const optionDefinitions = [
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

export default optionDefinitions;
