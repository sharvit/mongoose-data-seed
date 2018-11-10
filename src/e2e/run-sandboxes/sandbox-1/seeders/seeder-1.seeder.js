import { Seeder } from '../../../src/lib';

export default class Seeder1Seeder extends Seeder {
  async beforeRun() {
    console.log('Seeder1Seeder::beforeRun');
  }

  async shouldRun() {
    console.log('Seeder1Seeder::shouldRun');
    return true;
  }

  async run() {
    console.log('Seeder1Seeder::run');
  }
}
