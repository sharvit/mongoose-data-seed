import generateUsageGuide from 'command-line-usage';
import { optionDefinitions } from './options';

const usageGuide = generateUsageGuide([
  {
    header: 'Seed runner',
    content: 'Seed data into the database',
  },
  {
    header: 'Synopsis',
    content: [
      '$ md-seed run [[bold]{--dropdb}] [[bold]{--seeders} [underline]{seeder} ...]',
      '$ md-seed run [bold]{--help}',
    ],
  },
  {
    header: 'Options',
    optionList: optionDefinitions,
  },
  {
    header: 'Examples',
    content: `[bold]{1. Run all seeders:}
      $ md-seed run

      [bold]{2. Run selected seeders:}
      $ md-seed run [bold]{--seeders} [underline]{User} [underline]{Settings}
      [italic]{  or}
      $ md-seed run [bold]{-s} [underline]{User} [underline]{Settings}
      [italic]{  or}
      $ md-seed run [underline]{User} [underline]{Settings}

      [bold]{3. Drop database and run all seeders:}
      $ md-seed run [bold]{--dropdb}
      [italic]{  or}
      $ md-seed run [bold]{-d}

      [bold]{4. Drop database and run selected seeders:}
      $ md-seed run [underline]{User} [underline]{Settings} [bold]{--dropdb}
      [italic]{  or}
      $ md-seed run [underline]{User} [underline]{Settings} [bold]{-d}
      `,
  },
]);

export default usageGuide;
