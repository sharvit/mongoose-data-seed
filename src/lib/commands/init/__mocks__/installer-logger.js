import sinon from 'sinon';

const InstallerLogger = sinon.stub();

InstallerLogger.stubbedOvserver = 'some-stubbed-observer';

InstallerLogger.prototype.asObserver = sinon
  .stub()
  .returns(InstallerLogger.stubbedOvserver);

export default InstallerLogger;
