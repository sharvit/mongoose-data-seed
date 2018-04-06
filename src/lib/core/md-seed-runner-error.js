export default class MdSeedRunnerError extends Error {
  constructor({ type = '', payload = {}, error = {} } = {}) {
    super(error.message || 'MdSeedRunnerError');

    this.name = 'MdSeedRunnerError';
    this.type = type;
    this.payload = { ...payload, error };
  }
}
