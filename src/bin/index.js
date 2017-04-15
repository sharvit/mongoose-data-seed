#!/usr/bin/env node

import 'babel-register'; // eslint-disable-line import/no-unassigned-import
import 'babel-polyfill'; // eslint-disable-line import/no-unassigned-import

import commandLineCommands from 'command-line-commands';

// Import commands
import run from './run';
import init from './init';
import generate from './generate';

const INIT_COMMAND = 'init';
const RUN_COMMAND = 'run';
const GENERATE_COMMAND = 'generate';
const GENERATE_ALIAS_COMMAND = 'g';

const validCommands = [INIT_COMMAND, RUN_COMMAND, GENERATE_COMMAND, GENERATE_ALIAS_COMMAND];
const { command, argv } = commandLineCommands(validCommands);

try {
  // Run the selected command
  switch (command) {
    case INIT_COMMAND: {
      init(argv);
      break;
    }
    case RUN_COMMAND: {
      run(argv)
        .then(
          () => process.exit(),
          err => {
            if (err.message) {
              console.log(err.message);
            }

            process.exit(1);
          }
        )
      ;
      break;
    }
    case GENERATE_COMMAND:
    case GENERATE_ALIAS_COMMAND: {
      generate(argv);
      break;
    }
    default: {
      console.log('show help');
      break;
    }
  }
} catch (err) {
  if (err.message !== 'exit') {
    console.log(err.message);
  }

  process.exit(1);
}
