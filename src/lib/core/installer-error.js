/**
 * Installer Error
 */
export default class InstallerError extends Error {
  /**
   * Creates an InstallerError.
   * @param {Object} [options={}]         options
   * @param {String} [options.type='']    The error type key (Installer.operations).
   * @param {Object} [options.payload={}] A custom payload object.
   * @param {Error}  [options.error={}]   Error object.
   */
  constructor({ type = '', payload = {}, error = {} } = {}) {
    super(error.message || 'InstallerError');

    /**
     * Error name.
     * @type {String}
     */
    this.name = 'InstallerError';
    /**
     * Error type (one of the Installer.operations).
     * @type {String}
     */
    this.type = type;
    /**
     * Custom payload object.
     * @type {Object}
     */
    this.payload = { ...payload, error };
  }
}
