import { Observable } from 'rxjs/Observable';

const runSeeders = (seeders = {}) => {
  return Observable.create(async observer => {
    for (const name of Object.keys(seeders)) {
      observer.next({ name });

      try {
        const seeder = new seeders[name]();
        const results = await seeder.seed(); // eslint-disable-line no-await-in-loop

        observer.next({ name, results });
      } catch (err) {
        observer.error({ name, error: err });
      }
    }

    observer.complete();
  });
};

export default runSeeders;
