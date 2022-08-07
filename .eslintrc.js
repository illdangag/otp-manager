module.exports = {
  'ignorePatterns': ['node_modules/*', '**/.eslintrc.js'],
  'env': {
    'browser': true,
    'node': true,
  },
  'parser': '@typescript-eslint/parser',
  'parserOptions': {
    'sourceType': 'module',
  },
  'plugins': [
    '@typescript-eslint',
  ],
  'rules': {
    '@typescript-eslint/indent': ['error', 2, {
      ObjectExpression: 1,
      SwitchCase: 1,
    },],
    'indent': ['error', 2, {
      ObjectExpression: 1,
      SwitchCase: 1,
    },],
    'semi': ['error', 'always',],
    'no-extra-semi': 'error',
    'comma-dangle': 'off',
    '@typescript-eslint/comma-dangle': ['error', {
      'arrays': 'always',
      'exports': 'always',
      'functions': 'always-multiline',
      'imports': 'always',
      'objects': 'always',
      'enums': 'always',
    },],
    'space-before-function-paren': ['error', {
      'anonymous': 'always',
      'asyncArrow': 'always',
      'named': 'always',
    },],
    'no-trailing-spaces': 'error',
    '@typescript-eslint/no-floating-promises': 'error',
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': ['warn',],
    'arrow-spacing': ['error', {
      'before': true,
      'after': true,
    },],
    'space-infix-ops': ['error', {
      int32Hint: false,
    },],
    'object-curly-spacing': ['error', 'always',],
    'quotes': ['error', 'single',],
    'jsx-quotes': ['error', 'prefer-single',],
    'no-console': ['warn', {allow: ['warn', 'error',],},],
    'eol-last': ['error', 'always',],
  },
};
