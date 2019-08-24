import commandLineCommands from 'command-line-commands';
import {
  commandsMap,
  aliases,
  defaultCommand,
  availableCommandsList,
} from './constants';

/**
 * Whether a given command is an alias
 * @param  {string}  command
 * @return {Boolean}
 */
export const isAlias = command => Object.keys(aliases).includes(command);

/**
 * Get the command name of a given alias
 * @param  {string} alias
 * @return {string}
 */
export const aliasToCommand = alias => aliases[alias];

/**
 * Get the function of a given command
 * @param  {string}   command command name
 * @return {Function} command function
 */
export const commandToFunction = command => {
  command = command || defaultCommand;

  if (isAlias(command)) {
    command = aliasToCommand(command);
  }

  return commandsMap[command];
};

/**
 * Get the command and the arguments from the cli
 * @return   {Object}
 * @property {string}   command command name
 * @property {string[]} argv    command arguments
 */
export const getCommandAndArgvFromCli = () => {
  const { command, argv } = commandLineCommands(availableCommandsList);

  return { command, argv };
};

/**
 * Run command
 * @param  {string} command command name
 * @param  {string} argv    command arguments
 */
export const runCommand = (command, argv) => {
  const commandFunction = commandToFunction(command);

  return commandFunction(argv);
};
