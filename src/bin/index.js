#!/usr/bin/env node

import 'babel-register';
import 'babel-polyfill';

import { runCommand, getCommandAndArgvFromCli } from '../lib/commands/helpers';
import { exit } from '../lib/utils/helpers';

const run = async () => {
  try {
    // recive the command and the arguments input from the cli
    const { command, argv } = getCommandAndArgvFromCli();

    // run the cli command
    await runCommand(command, argv);

    exit();
  } catch (error) {
    exit(error);
  }
};

run();
