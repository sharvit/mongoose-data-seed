import sinon from 'sinon';

const RunLogger = sinon.stub();

RunLogger.stubbedOvserver = 'some-stubbed-observer';

RunLogger.prototype.asObserver = sinon
  .stub()
  .returns(RunLogger.stubbedOvserver);

export default RunLogger;
