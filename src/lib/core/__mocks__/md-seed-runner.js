import sinon from 'sinon';

const MdSeedRunner = sinon.stub();

MdSeedRunner.stubbedOvservable = {
  subscribe: sinon.stub(),
  toPromise: sinon.stub().resolves(),
};

MdSeedRunner.prototype.run = sinon
  .stub()
  .returns(MdSeedRunner.stubbedOvservable);

export default MdSeedRunner;
