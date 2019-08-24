/**
 * Init command option defenitions
 * @type {Object[]}
 */
const optionDefinitions = [
  {
    name: 'seedersFolder',
    alias: 'f',
    type: String,
    description: 'Seeders folder name',
  },
  {
    name: 'seederTemplate',
    alias: 't',
    type: String,
    description: 'Seeder template file path',
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
