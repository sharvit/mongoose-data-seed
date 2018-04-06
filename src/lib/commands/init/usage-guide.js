import generateUsageGuide from 'command-line-usage';
import { optionDefinitions } from './options';

const usageGuide = generateUsageGuide([
  {
    header: 'Initialize mongoose-data-seed',
    content: `Install mongoose-data-seed into your project.
      Generate md-seed-config.js, md-seed-generator.js and create seeders folder`,
  },
  {
    header: 'Synopsis',
    content: [
      '$ md-seed init [[bold]{--es6}] [[bold]{--seedersFolder}=[underline]{folder-name}]',
      '$ md-seed init [bold]{--help}',
    ],
  },
  {
    header: 'Options',
    optionList: optionDefinitions,
  },
]);

export default usageGuide;
