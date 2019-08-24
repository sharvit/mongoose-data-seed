import generate from './generate';
import help from './help';
import init from './init';
import run from './run';

/**
 * Available command names
 *
 * Map command key to command name
 * @type {Map<string, string>}
 */
export const commands = {
  GENERATE: 'generate',
  HELP: 'help',
  INIT: 'init',
  RUN: 'run',
};

/**
 * Available command aliases
 *
 * Map alias to command name
 * @type {Map<string, string>}
 */
export const aliases = {
  g: commands.GENERATE,
  h: commands.HELP,
};

/**
 * All available command names as list (includes aliases)
 * @type {string[]}
 */
export const availableCommandsList = [
  null, // no command should run help
  ...Object.values(commands),
  ...Object.keys(aliases),
];

/**
 * Commands map
 *
 * Map command name to the actuall command function
 * @type {Map<string, Function>}
 */
export const commandsMap = {
  [commands.GENERATE]: generate,
  [commands.HELP]: help,
  [commands.INIT]: init,
  [commands.RUN]: run,
};

/**
 * The fefault command name
 * @type {string}
 */
export const defaultCommand = commands.HELP;
