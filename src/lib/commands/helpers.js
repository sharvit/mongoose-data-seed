import commandLineCommands from 'command-line-commands';
import {
  commandsMap,
  aliases,
  defaultCommand,
  availableCommandsList,
} from './constants';

export const isAlias = command => Object.keys(aliases).includes(command);

export const aliasToCommand = alias => aliases[alias];

export const commandToFunction = command => {
  command = command || defaultCommand;

  if (isAlias(command)) {
    command = aliasToCommand(command);
  }

  return commandsMap[command];
};

export const getCommandAndArgvFromCli = () => {
  const { command, argv } = commandLineCommands(availableCommandsList);

  return { command, argv };
};

export const runCommand = (command, argv) => {
  const commandFunction = commandToFunction(command);

  return commandFunction(argv);
};
