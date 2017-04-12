const runSeeders = async (seeders) => {
  const seed = {};

  for (let s in seeders) {
    const seeder = new seeders[s]();

    seed[s] = await seeder.seed();
  }

  return seed;
};

export default runSeeders;
