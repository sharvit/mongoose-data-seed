import sinon from 'sinon';

export default class Subject {
  next = sinon.stub();

  complete = sinon.stub();

  error = sinon.stub();
}
