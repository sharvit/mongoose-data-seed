require('@babel/register')({
  extends: './.babelrc',
  ignore: [/node_modules/],
});

require('core-js/stable');
require('regenerator-runtime/runtime');

const chalk = require('chalk');

chalk.enabled = false;
