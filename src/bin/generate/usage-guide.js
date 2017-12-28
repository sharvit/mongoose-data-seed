import generateUsageGuide from 'command-line-usage';
import { optionDefinitions } from './options';

const usageGuide = generateUsageGuide([
  {
    header: 'Generate Seeder',
    content: 'Generate new seeder file into the seeder folder.',
  },
  {
    header: 'Synopsis',
    content: [
      '$ md-seed generate [underline]{seeder-name}',
      '$ md-seed g [underline]{seeder-name}',
      '$ md-seed g [bold]{--help}',
    ],
  },
  {
    header: 'Options',
    optionList: optionDefinitions,
  },
]);

export default usageGuide;
