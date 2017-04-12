import generateUsageGuide from 'command-line-usage';
import { optionDefinitions } from './options';

const usageGuide = generateUsageGuide([
  {
    header: 'Generate Seeder',
    content: 'Generate new seeder file into the seeder folder'
  }, {
    header: 'Synopsis',
    content: [
      '$ md-seed generate users',
      '$ md-seed g users',
      '$ md-seed g --help',
    ]
  }
]);

export default usageGuide;
