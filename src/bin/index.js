#!/usr/bin/env node

import 'babel-register';
import 'babel-polyfill';

import commandLineCommands from 'command-line-commands';

import usageGuide from './usage-guide';

// Import commands
import run from './run';
import init from './init';
import generate from './generate';

const INIT_COMMAND = 'init';
const RUN_COMMAND = 'run';
const GENERATE_COMMAND = 'generate';
const GENERATE_ALIAS_COMMAND = 'g';

const validCommands = [
  null,
  INIT_COMMAND,
  RUN_COMMAND,
  GENERATE_COMMAND,
  GENERATE_ALIAS_COMMAND,
];
const { command, argv } = commandLineCommands(validCommands);

try {
  // Run the selected command
  switch (command) {
    case INIT_COMMAND: {
      init(argv);
      break;
    }

    case RUN_COMMAND: {
      run(argv).then(
        () => process.exit(),
        err => {
          if (err && err.message) {
            console.log(err.message);
          }

          process.exit(1);
        }
      );
      break;
    }

    case GENERATE_COMMAND:
    case GENERATE_ALIAS_COMMAND: {
      generate(argv);
      break;
    }

    // Show usage guide
    default: {
      console.log(usageGuide);
      break;
    }
  }
} catch (err) {
  if (err.message !== 'exit') {
    console.log(err.message);
  }

  process.exit(1);
}
