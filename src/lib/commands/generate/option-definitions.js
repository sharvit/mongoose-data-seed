/**
 * Generate command option defenitions
 * @type {Object[]}
 */
const optionDefinitions = [
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

export default optionDefinitions;
