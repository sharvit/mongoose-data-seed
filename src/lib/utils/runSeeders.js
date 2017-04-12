import { Observable } from 'rxjs/Observable';

const runSeeders = (seeders) => {
  return Observable.create(async (observer) => {

    for (let name in seeders) {
      observer.next({ name });

      try {
        const seeder = new seeders[name]();
        const results = await seeder.seed();

        observer.next({ name, results });
      } catch (error) {
        observer.error({name, error });
      }
    }

    observer.complete();
  });
};

export default runSeeders;
