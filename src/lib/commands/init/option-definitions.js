const optionDefinitions = [
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
