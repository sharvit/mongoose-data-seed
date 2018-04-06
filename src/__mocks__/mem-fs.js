import sinon from 'sinon';

export const store = 'some-store';

export default {
  create: sinon.stub().returns(store),
};
