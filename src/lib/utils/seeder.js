/**
 * Base class for seeders to extend.
 *
 * Seeder is an Abstract base class
 * in order to use Seeder you need to
 * extend Seeder into your own class and implement async run() method
 *
 * @example
 * import { Seeder } from 'mongoose-data-seed';
 * import { User } from '../server/models';
 *
 * const data = [
 *   {
 *     email: 'user1@gmail.com',
 *     password: '123123',
 *     passwordConfirmation: '123123',
 *     isAdmin: true,
 *   },
 *   {
 *     email: 'user2@gmail.com',
 *     password: '123123',
 *     passwordConfirmation: '123123',
 *     isAdmin: false,
 *   },
 * ];
 *
 * class UsersSeeder extends Seeder {
 *   async shouldRun() {
 *     const count = await User.countDocuments().exec();
 *
 *     return count === 0;
 *   }
 *
 *   async run() {
 *     return User.create(data);
 *   }
 * }
 *
 * export default UsersSeeder;
 */
class Seeder {
  /**
   * Abstract class can not be constructed.
   * Seeder class should be extended.
   * @abstract
   * @throws {TypeError} when creating an instance of the abstract class.
   * @throws {TypeError} when the run method is not implemented.
   */
  constructor() {
    if (this.constructor === Seeder) {
      throw new TypeError('Can not construct abstract class.');
    }
    if (this.run === Seeder.prototype.run) {
      throw new TypeError('Please implement abstract method run.');
    }
  }

  /**
   * Seed the data.
   * @return {Promise} Stats about the save.
   */
  async seed() {
    await this.beforeRun();

    let results = null;

    if (await this.shouldRun()) {
      results = await this.run();
    }

    return this.getStats(results);
  }

  /**
   * Should run
   * @return {Promise<boolean>} Indication if should run
   * @abstract
   */
  async shouldRun() {
    return true;
  }

  /**
   * To perform before run.
   * @return {Promise}
   * @abstract
   */
  async beforeRun() {}

  /**
   * Run the seeder.
   * @abstract
   */
  async run() {
    throw new TypeError(
      `Need to implement ${this.constructor.name} async run() function`
    );
  }

  /**
   * Get stats from seed results.
   * @param  {Array} [results] Seed results.
   * @return {Object}
   * @property {boolean} run      Did the seeder run?
   * @property {number}  created  Amount of records created by the seeder.
   */
  getStats(results) {
    if (Array.isArray(results)) {
      return { run: true, created: results.length };
    }

    return { run: false, created: 0 };
  }

  /**
   * Creates a new seeder by extending the base seeder.
   * Useful when not using old javascript
   * @param  {Object} [userSeederMethods={}]  Object with the seeders method
   *                                          (e.g. run, shouldRun, beforeRun ...)
   * @return {Seeder}
   *
   * @example
   * Seeder.extends({
   *   shouldRun: function() {
   *     return User.countDocuments()
   *       .exec()
   *       .then(function(count) {
   *         return count === 0;
   *       });
   *   },
   *   run: function() {
   *     return User.create(data);
   *   }
   * });
   */
  static extend(userSeederMethods = {}) {
    class UserSeeder extends Seeder {}

    // Add methods to the user seeder
    Object.keys(userSeederMethods).forEach(key => {
      UserSeeder.prototype[key] = userSeederMethods[key];
    });

    return UserSeeder;
  }
}

export default Seeder;
