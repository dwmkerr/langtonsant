const js = require('@eslint/js');
const globals = require('globals');

module.exports = [
  {
    ignores: ['dist/**', 'artifacts/**', '.nyc_output/**']
  },
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2018,
      //  The app is ES modules; the lib and the config files are CommonJS.
      //  Module parsing accepts both, and the node globals cover the latter.
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.mocha
      }
    },
    rules: {
      indent: ['error', 2, { SwitchCase: 1 }],
      'no-console': 'off',
      'linebreak-style': ['error', 'unix'],
      quotes: ['error', 'single'],
      semi: ['error', 'always']
    }
  }
];
