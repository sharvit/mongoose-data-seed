import generateUsageGuide from 'command-line-usage';

/**
 * Help command user guide
 * @type {string}
 */
const usageGuide = generateUsageGuide([
  {
    header: 'Mongoose Data Seeder',
    content: 'Seed data into the database',
  },
  {
    header: 'Synopsis',
    content: ['$ md-seed <command> <options>'],
  },
  {
    header: 'Command List',
    content: [
      {
        command: 'init',
        description: 'Install mongoose-data-seed into your project.',
      },
      {
        command: 'g, generate',
        description: 'Generate new seeder file into the seeder folder.',
      },
      {
        command: 'run',
        description: 'Run seeders.',
      },
      {
        command: 'h, help',
        description: 'Show help',
      },
    ],
  },
]);

export default usageGuide;
