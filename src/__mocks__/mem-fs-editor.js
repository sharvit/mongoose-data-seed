import sinon from 'sinon';
import { store } from './mem-fs-editor';

export const fs = 'some fs';

export default {
  create: sinon
    .stub()
    .withArgs(store)
    .returns(fs),
};
