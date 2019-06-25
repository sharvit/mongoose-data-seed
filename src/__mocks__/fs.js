import sinon from 'sinon';

export const alreadyExistsFilename = 'exists';
export const alreadyExistsPath = `/path/${alreadyExistsFilename}`;
export const throwableMkdirPath = '/path/will-throw';

const existsSync = sinon.stub();
existsSync.returns(false);
existsSync.withArgs(alreadyExistsPath).returns(true);

const mkdirSync = sinon.stub();
mkdirSync.withArgs(throwableMkdirPath).throws(new Error('some-error'));

export default { existsSync, mkdirSync };
