import test from 'ava';
import sinon from 'sinon';

import runSeeders from '../run-seeders';
import Seeder from '../seeder';

test('should be completed with no values when suplying no seeders', t => {
  runSeeders().subscribe({
    next: () => t.fail(),
    error: () => t.fail(),
    complete: () => t.pass(),
  });
});

test('should be completed with values and no erros', t => {
  t.plan(4);

  const seeders = {
    Seeder1: Seeder.extend({
      run: sinon.stub().returns(Promise.resolve(['', ''])),
    }),
  };

  return new Promise((resolve, reject) => {
    runSeeders(seeders).subscribe({
      next: ({ name, results }) => {
        t.is(name, 'Seeder1');

        if (results) {
          t.deepEqual(results, { run: true, created: 2 });
        }
      },
      error: err => {
        reject(err);
      },
      complete: () => {
        t.pass();
        resolve();
      },
    });
  });
});

test('should run 2 seeders while last is failed', t => {
  t.plan(5);

  const seeders = {
    Seeder1: Seeder.extend({
      run: sinon.stub().returns(Promise.resolve([''])),
    }),
    Seeder2: Seeder.extend({}),
  };

  return new Promise(resolve => {
    runSeeders(seeders).subscribe({
      next: ({ name, results }) => {
        switch (name) {
          case 'Seeder1': {
            t.is(name, 'Seeder1');

            if (results) {
              t.deepEqual(results, { run: true, created: 1 });
            }

            break;
          }

          case 'Seeder2': {
            t.is(name, 'Seeder2');
            break;
          }

          default: {
            break;
          }
        }
      },
      error: ({ name }) => {
        t.is(name, 'Seeder2');
        resolve();
      },
      complete: () => {
        t.pass();
        resolve();
      },
    });
  });
});
