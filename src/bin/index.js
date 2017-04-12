#!/usr/bin/env node

import 'babel-register';
import 'babel-polyfill';

import commandLineCommands from 'command-line-commands';

const INIT_COMMAND = 'init';
const RUN_COMMAND  = 'run';
const GENERATE_COMMAND  = 'generate';
const GENERATE_ALIAS_COMMAND  = 'g';

const validCommands = [INIT_COMMAND, RUN_COMMAND, GENERATE_COMMAND, GENERATE_ALIAS_COMMAND];
const { command, argv } = commandLineCommands(validCommands);

// override the proccess argv
process.argv = argv;

// load the commands with require so it will
// get loaded after overriding the procces argv
const run = require('./run').default;
const init = require('./init').default;
const generate = require('./generate').default;

// Run the selected command
switch (command) {
	case INIT_COMMAND: {
		init();
		break;
	}
	case RUN_COMMAND: {
		run();
		break;
	}
  case GENERATE_COMMAND:
  case GENERATE_ALIAS_COMMAND: {
    generate();
    break;
  }
	default: {
		console.log('show help');
		break;
	}
}
