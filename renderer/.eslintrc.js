const config = require('../.eslintrc.js');
config.parserOptions.project = './renderer/tsconfig.json';
module.exports = config;
