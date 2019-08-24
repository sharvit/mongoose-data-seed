import '@babel/register';
import 'core-js/stable';
import 'regenerator-runtime/runtime';

import { runCommand, getCommandAndArgvFromCli } from '../lib/commands/helpers';
import { exit } from '../lib/utils/helpers';

/**
 * Main entry point, run md-seed cli
 * @return {Promise}
 */
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
