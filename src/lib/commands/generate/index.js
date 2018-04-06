import { getOptions } from './options';
import help from './help';
import generateSeeder from './generate-seeder';

export default async argv => {
  const { seederName, helpWanted } = getOptions(argv);

  if (helpWanted) return help();

  await generateSeeder(seederName);
};
