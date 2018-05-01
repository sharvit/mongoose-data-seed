import { Seeder } from '../../../src/lib';

export default class Seeder3Seeder extends Seeder {
  async beforeRun() {
    console.log('Seeder3Seeder::beforeRun');
  }

  async shouldRun() {
    console.log('Seeder3Seeder::shouldRun');
    return true;
  }

  async run() {
    console.log('Seeder3Seeder::run');
  }
}
