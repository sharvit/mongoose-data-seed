import sinon from 'sinon';

const Installer = sinon.stub();

Installer.stubbedOvservable = {
  subscribe: sinon.stub(),
  toPromise: sinon.stub().resolves(),
};

Installer.prototype.install = sinon.stub().returns(Installer.stubbedOvservable);

export default Installer;
