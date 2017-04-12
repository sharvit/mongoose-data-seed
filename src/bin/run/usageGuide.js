import generateUsageGuide from 'command-line-usage';
import { optionDefinitions } from './options';

const usageGuide = generateUsageGuide([
  {
    header: 'Seed runner',
    content: 'Seed data into the database'
  }, {
    header: 'Synopsis',
    content: [
      '$ seed [[bold]{--dropdb}] [[bold]{--seeders} [underline]{seeder} ...]',
      '$ seed [bold]{--help}'
    ]
  }, {
    header: 'Options',
    optionList: optionDefinitions
  }, {
    header: 'Examples',
    content: (
      `[bold]{1. Run all seeders:}
      $ seed

      [bold]{2. Run selected seeders:}
      $ seed [bold]{--seeders} [underline]{User} [underline]{Settings}
      [italic]{  or}
      $ seed [bold]{-s} [underline]{User} [underline]{Settings}
      [italic]{  or}
      $ seed [underline]{User} [underline]{Settings}

      [bold]{3. Drop database and run all seeders:}
      $ seed [bold]{--dropdb}
      [italic]{  or}
      $ seed [bold]{-d}

      [bold]{4. Drop database and run selected seeders:}
      $ seed [underline]{User} [underline]{Settings} [bold]{--dropdb}
      [italic]{  or}
      $ seed [underline]{User} [underline]{Settings} [bold]{-d}
      `
    )
  }
]);

export default usageGuide;
