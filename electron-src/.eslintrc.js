const config = require('../.eslintrc.js');
config.parserOptions.project = './electron-src/tsconfig.json';
module.exports = config;
