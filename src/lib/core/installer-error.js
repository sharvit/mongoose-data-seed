export default class InstallerError extends Error {
  constructor({ type = '', payload = {}, error = {} } = {}) {
    super(error.message || 'InstallerError');

    this.name = 'InstallerError';
    this.type = type;
    this.payload = { ...payload, error };
  }
}
