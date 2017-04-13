class Seeder {
  async seed() {
    await this.beforeRun();

    let results = null;

    if (await this.shouldRun()) {
      results = await this.run();
    }

    return this.getStats(results);
  }

  async shouldRun() {
    return true;
  }

  async beforeRun() {

  }

  async run() {
    throw new Error(`Need to implement ${this.constructor.name} async run() function`);
  }

  getStats(results) {
    if (Array.isArray(results)) {
      return { run: true, created: results.length };
    }

    return { run: false, created: 0 };
  }

  static extend(userSeederMethods) {
    class userSeeder extends Seeder { }

    // Add methods to the user seeder
    Object.keys(userSeederMethods).forEach(key => {
      userSeeder.prototype[key] = userSeederMethods[key];
    });

    return userSeeder;
  }
}

export default Seeder;
