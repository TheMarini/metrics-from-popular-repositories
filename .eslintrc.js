module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: ['airbnb-base', 'prettier'],
  plugins: ['prettier'],
  rules: {
    'no-console': 'off',
    'no-debugger': 'off',
  },
  parserOptions: {
    parser: 'babel-eslint',
  },
};
