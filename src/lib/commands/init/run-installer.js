import { Installer } from '../../core';
import { promptMissingOptions } from './options';
import InstallerLogger from './installer-logger';

export default async (options = {}) => {
  // get relevat config and options
  const { seedersFolder, customSeederTemplate } = await promptMissingOptions(
    options
  );

  // create logger
  const logger = new InstallerLogger();

  // create installer
  const installer = new Installer({ seedersFolder, customSeederTemplate });

  // run seeders
  const observable = installer.install();

  // subscribe logger
  observable.subscribe(logger.asObserver());

  // wait for installer to finish
  await observable.toPromise();
};
