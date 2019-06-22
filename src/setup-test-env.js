require('@babel/register')({
  extends: './.babelrc',
  ignore: [/node_modules/],
});
require('@babel/polyfill');
