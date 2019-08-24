/**
 * MdSeedRunner Error
 */
export default class MdSeedRunnerError extends Error {
  /**
   * Creates an MdSeedRunnerError.
   * @param {Object} [options={}]         options
   * @param {String} [options.type='']    The error type key (MdSeedRunner.operations).
   * @param {Object} [options.payload={}] A custom payload object.
   * @param {Error}  [options.error={}]   Error object.
   */
  constructor({ type = '', payload = {}, error = {} } = {}) {
    super(error.message || 'MdSeedRunnerError');

    /**
     * Error name.
     * @type {String}
     */
    this.name = 'MdSeedRunnerError';
    /**
     * Error type (one of the MdSeedRunner.operations).
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
