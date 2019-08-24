import test from 'ava';
import sinon from 'sinon';
import { toArray } from 'rxjs/operators';

import { mockImports, resetImports } from '../utils/test-helpers';

import MdSeedRunnerError from './md-seed-runner-error';

import MdSeedRunner, {
  __RewireAPI__ as moduleRewireAPI,
} from './md-seed-runner';

const helpData = {
  connect: sinon.stub().resolves(),
  dropdb: sinon.stub().resolves(),
  seedersList: {
    Users: 'users-seeder',
    Posts: 'posts-seeder',
  },
};

test.beforeEach('mock imports', t => {
  const mocks = {
    getObjectWithSelectedKeys: sinon.stub(),
    normalizeSeederName: sinon.stub().returnsArg(0),
  };

  t.context = { mocks };

  mockImports({ moduleRewireAPI, mocks });
});

test.afterEach.always('unmock imports', t => {
  const imports = Object.keys(t.context.mocks);

  resetImports({ moduleRewireAPI, imports });
});

test('Should create a run-logger instance', t => {
  const seedRunner = new MdSeedRunner({ ...helpData });

  t.is(seedRunner.connect, helpData.connect);
  t.is(seedRunner.dropdb, helpData.dropdb);
  t.is(seedRunner.seedersList, helpData.seedersList);
  t.is(typeof seedRunner.run, 'function');
});

test('Should run', t => {
  const seedRunner = new MdSeedRunner({ ...helpData });

  sinon.stub(seedRunner, '_run');

  const observable = seedRunner.run();

  t.true(
    seedRunner._run.calledWith({ selectedSeeders: [], dropDatabase: false })
  );
  t.is(typeof observable.subscribe, 'function');
});

test('Should run with args', t => {
  const seedRunner = new MdSeedRunner({ ...helpData });

  sinon.stub(seedRunner, '_run');

  const selectedSeeders = Object.keys(helpData.seedersList);
  const dropDatabase = true;

  const observable = seedRunner.run({ selectedSeeders, dropDatabase });

  t.true(seedRunner._run.calledWith({ selectedSeeders, dropDatabase }));
  t.is(typeof observable.subscribe, 'function');
});

test('Should _run', async t => {
  t.plan(4);

  const seedRunner = new MdSeedRunner({ ...helpData });

  sinon.stub(seedRunner, '_connectToMongodb').resolves();
  sinon.stub(seedRunner, '_dropDatabase').resolves();
  sinon.stub(seedRunner, '_runSeeders').resolves();

  const selectedSeeders = Object.keys(helpData.seedersList);
  const dropDatabase = false;

  seedRunner._subject
    .asObservable()
    .pipe(toArray())
    .toPromise()
    .then(results => t.snapshot(results));

  await seedRunner._run({ selectedSeeders, dropDatabase });

  t.true(seedRunner._connectToMongodb.called);
  t.true(seedRunner._runSeeders.calledWith(selectedSeeders));
  t.false(seedRunner._dropDatabase.called);
});

test('Should _run and drop database', async t => {
  t.plan(4);

  const seedRunner = new MdSeedRunner({ ...helpData });

  sinon.stub(seedRunner, '_connectToMongodb').resolves();
  sinon.stub(seedRunner, '_dropDatabase').resolves();
  sinon.stub(seedRunner, '_runSeeders').resolves();

  const selectedSeeders = Object.keys(helpData.seedersList);
  const dropDatabase = true;

  seedRunner._subject
    .asObservable()
    .pipe(toArray())
    .toPromise()
    .then(results => t.snapshot(results));

  await seedRunner._run({ selectedSeeders, dropDatabase });

  t.true(seedRunner._connectToMongodb.called);
  t.true(seedRunner._runSeeders.calledWith(selectedSeeders));
  t.true(seedRunner._dropDatabase.called);
});

test('Should _run and fail', async t => {
  t.plan(4);

  const seedRunner = new MdSeedRunner({ ...helpData });

  sinon.stub(seedRunner, '_connectToMongodb').rejects();
  sinon.stub(seedRunner, '_dropDatabase').resolves();
  sinon.stub(seedRunner, '_runSeeders').resolves();

  const selectedSeeders = Object.keys(helpData.seedersList);
  const dropDatabase = true;

  seedRunner._subject
    .asObservable()
    .pipe(toArray())
    .toPromise()
    .catch(error => t.snapshot(error));

  await seedRunner._run({ selectedSeeders, dropDatabase });

  t.true(seedRunner._connectToMongodb.called);
  t.false(seedRunner._runSeeders.called);
  t.false(seedRunner._dropDatabase.called);
});

test('Should _run and fail with type and payload', async t => {
  t.plan(4);

  const seedRunner = new MdSeedRunner({ ...helpData });

  const error = new MdSeedRunnerError({
    type: 'some-type',
    payload: { some: 'data' },
    error: new Error('some error message'),
  });

  sinon.stub(seedRunner, '_connectToMongodb').rejects(error);
  sinon.stub(seedRunner, '_dropDatabase').resolves();
  sinon.stub(seedRunner, '_runSeeders').resolves();

  const selectedSeeders = Object.keys(helpData.seedersList);
  const dropDatabase = true;

  seedRunner._subject
    .asObservable()
    .pipe(toArray())
    .toPromise()
    .catch(error => t.snapshot(error));

  await seedRunner._run({ selectedSeeders, dropDatabase });

  t.true(seedRunner._connectToMongodb.called);
  t.false(seedRunner._runSeeders.called);
  t.false(seedRunner._dropDatabase.called);
});

test('Should _connectToMongodb', async t => {
  t.plan(2);

  const seedRunner = new MdSeedRunner({ ...helpData });

  seedRunner._subject
    .asObservable()
    .pipe(toArray())
    .toPromise()
    .then(results => t.snapshot(results));

  await seedRunner._connectToMongodb();

  seedRunner._subject.complete();

  t.true(helpData.connect.called);
});

test('Should _connectToMongodb and fail', async t => {
  t.plan(3);

  const data = {
    ...helpData,
    connect: sinon.stub().rejects(new Error('some-error')),
  };

  const seedRunner = new MdSeedRunner({ ...data });

  seedRunner._subject
    .asObservable()
    .pipe(toArray())
    .toPromise()
    .then(results => t.snapshot(results, 'observable results'));

  try {
    await seedRunner._connectToMongodb();
  } catch (error) {
    t.snapshot(error, 'connect to mongodb error');
  }

  seedRunner._subject.complete();

  t.true(data.connect.called);
});

test('Should _dropDatabase', async t => {
  t.plan(2);

  const seedRunner = new MdSeedRunner({ ...helpData });

  seedRunner._subject
    .asObservable()
    .pipe(toArray())
    .toPromise()
    .then(results => t.snapshot(results));

  await seedRunner._dropDatabase();

  seedRunner._subject.complete();

  t.true(helpData.dropdb.called);
});

test('Should _dropDatabase and fail', async t => {
  t.plan(3);

  const data = {
    ...helpData,
    dropdb: sinon.stub().rejects(new Error('some-error')),
  };

  const seedRunner = new MdSeedRunner({ ...data });

  seedRunner._subject
    .asObservable()
    .pipe(toArray())
    .toPromise()
    .then(results => t.snapshot(results, 'observable results'));

  try {
    await seedRunner._dropDatabase();
  } catch (error) {
    t.snapshot(error, 'dropdb error');
  }

  seedRunner._subject.complete();

  t.true(data.dropdb.called);
});

test('Should _runSeeders', async t => {
  t.plan(3);

  const selectedSeeders = Object.keys(helpData.seedersList);

  const seedRunner = new MdSeedRunner({ ...helpData });

  sinon
    .stub(seedRunner, '_loadSelectedSeeders')
    .withArgs(selectedSeeders)
    .returns(selectedSeeders);
  sinon.stub(seedRunner, '_runSeeder').resolves();

  seedRunner._subject
    .asObservable()
    .pipe(toArray())
    .toPromise()
    .then(results => t.snapshot(results, 'observable results'));

  await seedRunner._runSeeders(selectedSeeders);

  seedRunner._subject.complete();

  t.true(seedRunner._loadSelectedSeeders.calledWith(selectedSeeders));
  t.snapshot(seedRunner._runSeeder.args, '_runSeeder args');
});

test('Should _runSeeder', async t => {
  t.plan(3);

  const name = 'User';
  const Seeder = sinon.stub();
  Seeder.prototype.seed = sinon.stub().resolves('some-results');

  const seedRunner = new MdSeedRunner({ ...helpData });

  seedRunner._subject
    .asObservable()
    .pipe(toArray())
    .toPromise()
    .then(results => t.snapshot(results, 'observable results'));

  await seedRunner._runSeeder({ Seeder, name });

  seedRunner._subject.complete();

  t.true(Seeder.called);
  t.true(Seeder.prototype.seed.called);
});

test('Should _runSeeder and fail', async t => {
  t.plan(4);

  const name = 'User';
  const Seeder = sinon.stub();
  Seeder.prototype.seed = sinon.stub().rejects(new Error('some-error'));

  const seedRunner = new MdSeedRunner({ ...helpData });

  seedRunner._subject
    .asObservable()
    .pipe(toArray())
    .toPromise()
    .then(results => t.snapshot(results, 'observable results'));

  try {
    await seedRunner._runSeeder({ Seeder, name });
  } catch (error) {
    t.snapshot(error, '_runSeeder error');
  }

  seedRunner._subject.complete();

  t.true(Seeder.called);
  t.true(Seeder.prototype.seed.called);
});

test('should _loadSelectedSeeders with no args', t => {
  const seedRunner = new MdSeedRunner({ ...helpData });

  const selectedSeeders = seedRunner._loadSelectedSeeders();

  t.is(selectedSeeders, helpData.seedersList);
});

test('should _loadSelectedSeeders with empty array', t => {
  const seedRunner = new MdSeedRunner({ ...helpData });

  const selectedSeeders = seedRunner._loadSelectedSeeders([]);

  t.is(selectedSeeders, helpData.seedersList);
});

test('should _loadSelectedSeeders', t => {
  const { getObjectWithSelectedKeys } = t.context.mocks;

  const seedRunner = new MdSeedRunner({ ...helpData });

  seedRunner._loadSelectedSeeders(['User']);

  t.true(getObjectWithSelectedKeys.calledWith(helpData.seedersList, ['User']));
});
