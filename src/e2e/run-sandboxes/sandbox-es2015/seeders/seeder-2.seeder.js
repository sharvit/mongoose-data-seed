import { Seeder } from '../../../src/lib';

export default class Seeder2Seeder extends Seeder {
  async beforeRun() {
    console.log('Seeder2Seeder::beforeRun');
  }

  async shouldRun() {
    console.log('Seeder2Seeder::shouldRun');
    return false;
  }

  async run() {
    // shouldn't be running
    console.log('Seeder2Seeder::run');
  }
}
