/**
 * Mock imports in test
 * @private
 */
export const mockImports = ({ moduleRewireAPI, mocks }) => {
  for (const [name, mock] of Object.entries(mocks)) {
    moduleRewireAPI.__Rewire__(name, mock);
  }
};
/**
 * Reset imports in test
 * @private
 */
export const resetImports = ({ moduleRewireAPI, imports }) => {
  for (const name of imports) {
    moduleRewireAPI.__ResetDependency__(name);
  }
};
