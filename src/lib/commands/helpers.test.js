import test from 'ava';
import sinon from 'sinon';

import {
  aliases,
  commands,
  commandsMap,
  defaultCommand,
  availableCommandsList,
} from './constants';
import {
  isAlias,
  aliasToCommand,
  commandToFunction,
  runCommand,
  getCommandAndArgvFromCli,
  __RewireAPI__ as moduleRewireAPI,
} from './helpers';

test('isAlias should work', t => {
  Object.keys(aliases).forEach(a => t.is(isAlias(a), true));
  Object.keys(commands).forEach(c => t.is(isAlias(c), false));

  t.is(isAlias(), false);
});

test('aliasToCommand should work', t => {
  for ([alias, command] of Object.entries(aliases)) {
    t.is(aliasToCommand(alias), command);
  }
});

test('commandToFunction should work', t => {
  for ([command, func] of Object.entries(commandsMap)) {
    t.is(commandToFunction(command), func);
  }

  for ([alias, command] of Object.entries(aliases)) {
    t.is(commandToFunction(alias), commandToFunction(command));
  }

  t.is(commandToFunction(), commandToFunction(defaultCommand));
});

test('should get command and argv from cli', t => {
  const shouldReturn = { command: 'command', argv: 'argv' };
  const stub = sinon.stub().returns(shouldReturn);

  moduleRewireAPI.__Rewire__('commandLineCommands', stub);

  const result = getCommandAndArgvFromCli();

  t.true(stub.called);
  t.deepEqual(result, shouldReturn);

  moduleRewireAPI.__ResetDependency__('commandLineCommands');
});

test('runCommand should work', t => {
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
