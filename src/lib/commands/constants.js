import generate from './generate';
import help from './help';
import init from './init';
import run from './run';

export const commands = {
  GENERATE: 'generate',
  HELP: 'help',
  INIT: 'init',
  RUN: 'run',
};

export const aliases = {
  g: commands.GENERATE,
  h: commands.HELP,
};

export const availableCommandsList = [
  null, // no command should run help
  ...Object.values(commands),
  ...Object.keys(aliases),
];

export const commandsMap = {
  [commands.GENERATE]: generate,
  [commands.HELP]: help,
  [commands.INIT]: init,
  [commands.RUN]: run,
};

export const defaultCommand = commands.HELP;
