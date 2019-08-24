/**
 * Run command option defenitions
 * @type {Object[]}
 */
const optionDefinitions = [
  {
    name: 'seeders',
    alias: 's',
    type: String,
    multiple: true,
    defaultValue: [],
    defaultOption: true,
    typeLabel: 'seeder ...',
    description: 'Seeders names to run',
  },
  {
    name: 'dropdb',
    alias: 'd',
    type: Boolean,
    defaultValue: false,
    description: 'Drop the database before seeding',
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
