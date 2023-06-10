module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'plugin:react/recommended',
    'airbnb',
  ],
  overrides: [
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: [
    'react',
  ],
  rules: {
    'no-console': 0,
    'react/jsx-filename-extension': 0,
    'no-use-before-define': ['error', { functions: false }],
    // 'import/no-extraneous-dependencies': 0,
  },
  globals: {
    browser: 'readonly',
  },
};
