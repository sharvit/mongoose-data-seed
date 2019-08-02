import test from 'ava';
import sinon from 'sinon';

import Seeder from './seeder';

test('should throw error when trying to create new instance of Seeder', t => {
  t.throws(() => new Seeder(), TypeError);
});

test('should throw error if not implementing run method', t => {
  class MySeeder extends Seeder {}

  t.throws(() => new MySeeder(), TypeError);
});

test('should throw error when running the base run method', async t => {
  await t.throwsAsync(() => Seeder.prototype.run(), TypeError);
});

test('async shouldRun method need to return true', async t => {
  t.true(await Seeder.prototype.shouldRun());
});

test('async beforeRun need to return promise', async t => {
  await Seeder.prototype.beforeRun();
  t.pass();
});

test('getStats should return empty stats when not providing results args', t => {
  const acctual = Seeder.prototype.getStats();
  const excepted = { run: false, created: 0 };

  t.deepEqual(acctual, excepted);
});

test('getStats should return stats when providing results args', t => {
  const fakedResults = ['', '', '', '', '', ''];
  const acctual = Seeder.prototype.getStats(fakedResults);
  const excepted = { run: true, created: fakedResults.length };

  t.deepEqual(acctual, excepted);
});

test('static extend method should create a new class based on the Seeder class with the given methods', async t => {
  const MySeeder = Seeder.extend({
    run: sinon.stub().returns(Promise.resolve('run work')),
  });

  const baseClassName = Object.getPrototypeOf(MySeeder.prototype.constructor)
    .name;

  t.is(baseClassName, 'Seeder');
  t.is(await MySeeder.prototype.run(), 'run work');
});

test('static extend method should create a new class based on the Seeder class without methods', async t => {
  const MySeeder = Seeder.extend();

  MySeeder.prototype.run = sinon.stub().returns(Promise.resolve('run work'));

  const baseClassName = Object.getPrototypeOf(MySeeder.prototype.constructor)
    .name;

  t.is(baseClassName, 'Seeder');
  t.is(await MySeeder.prototype.run(), 'run work');
});

test('seed method should run seeder if shouldRun returns true', async t => {
  const fakedResults = ['', '', '', '', '', ''];

  const shouldRun = sinon.stub().returns(Promise.resolve(true));
  const beforeRun = sinon.stub().returns(Promise.resolve());
  const run = sinon.stub().returns(Promise.resolve(fakedResults));

  const MySeeder = Seeder.extend({ shouldRun, beforeRun, run });

  const mySeeder = new MySeeder();

  sinon.spy(mySeeder, 'getStats');

  const acctualResults = await mySeeder.seed();
  const exceptedResults = { run: true, created: fakedResults.length };

  t.true(beforeRun.calledBefore(shouldRun));
  t.true(shouldRun.calledBefore(run));
  t.true(run.called);
  t.true(mySeeder.getStats.calledWith(fakedResults));
  t.deepEqual(acctualResults, exceptedResults);
});

test('seed method should not run seeder if shouldRun returns false', async t => {
  const fakedResults = ['', '', '', '', '', ''];

  const shouldRun = sinon.stub().returns(Promise.resolve(false));
  const beforeRun = sinon.stub().returns(Promise.resolve());
  const run = sinon.stub().returns(Promise.resolve(fakedResults));

  const MySeeder = Seeder.extend({ shouldRun, beforeRun, run });

  const mySeeder = new MySeeder();

  sinon.spy(mySeeder, 'getStats');

  const acctualResults = await mySeeder.seed();
  const exceptedResults = { run: false, created: 0 };

  t.true(beforeRun.calledBefore(shouldRun));
  t.true(shouldRun.called);
  t.true(run.notCalled);
  t.true(mySeeder.getStats.calledAfter(shouldRun));
  t.deepEqual(acctualResults, exceptedResults);
});
