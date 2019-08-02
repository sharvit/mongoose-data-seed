import test from 'ava';
import sinon from 'sinon';

import { aliases, commands, commandsMap, defaultCommand } from './constants';
import {
  isAlias,
  aliasToCommand,
  commandToFunction,
  runCommand,
  getCommandAndArgvFromCli,
  __RewireAPI__ as moduleRewireAPI,
} from './helpers';

test.serial('isAlias should work', t => {
  Object.keys(aliases).forEach(a => t.is(isAlias(a), true));
  Object.keys(commands).forEach(c => t.is(isAlias(c), false));

  t.is(isAlias(), false);
});

test.serial('aliasToCommand should work', t => {
  for (const [alias, command] of Object.entries(aliases)) {
    t.is(aliasToCommand(alias), command);
  }
});

test.serial('commandToFunction should work', t => {
  for (const [command, func] of Object.entries(commandsMap)) {
    t.is(commandToFunction(command), func);
  }

  for (const [alias, command] of Object.entries(aliases)) {
    t.is(commandToFunction(alias), commandToFunction(command));
  }

  t.is(commandToFunction(), commandToFunction(defaultCommand));
});

test.serial('should get command and argv from cli', t => {
  const shouldReturn = { command: 'command', argv: 'argv' };
  const stub = sinon.stub().returns(shouldReturn);

  moduleRewireAPI.__Rewire__('commandLineCommands', stub);

  const result = getCommandAndArgvFromCli();

  t.true(stub.called);
  t.deepEqual(result, shouldReturn);

  moduleRewireAPI.__ResetDependency__('commandLineCommands');
});

test.serial('runCommand should work', t => {
  const spy = sinon.spy();
  const stub = sinon
    .stub()
    .withArgs('help')
    .returns(spy);

  moduleRewireAPI.__Rewire__('commandToFunction', stub);

  runCommand('help', 'some args...');

  t.true(stub.calledWith('help'));
  t.true(spy.calledWith('some args...'));

  moduleRewireAPI.__ResetDependency__('commandToFunction');
});
