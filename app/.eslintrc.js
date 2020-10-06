module.exports = {
  root: true,
  env: {
    node: true, // Node.jsで実行されるコードの静的検証
    browser: true, // ブラウザで実行されるコードの静的検証
    commonjs: true, // Commonjsで実行されるコードの静的検証
    es6: true, // Es6で実行されるコードの静的検証
  },
  // eslint-plugin-vueと組み合わせて動くようにする
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser', // Typescriptのパーサーを使用する
  },
  extends: [
    // チェック機能（優先順位の高いものから上に記載する）
    'plugin:@typescript-eslint/recommended',
    'plugin:vue/essential',
    'prettier/@typescript-eslint',
    'plugin:prettier/recommended',
  ],
  plugins: ['eslint-plugin-eslint-comments', '@typescript-eslint'],
  rules: {
    // 'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-unused-vars': 'warn',
    'no-console': 'warn',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'sort-keys': 'off',
    'new-cap': 'off',
    'eslint-comments/disable-enable-pair': 'warn',
    '@typescript-eslint/camelcase': 'off',
    '@typescript-eslint/ban-ts-ignore': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/no-var-requires': 'warn',
    '@typescript-eslint/no-empty-function': 'off',
    '@typescript-eslint/no-inferrable-types': 'off',
    '@typescript-eslint/interface-name-prefix': 'off',
    'prettier/prettier': [
      'error',
      {
        singleQuote: true,
        semi: false,
        endOfLine: 'auto',
      },
    ],
    '@typescript-eslint/ban-types': [
      'off',
      {
        types: {
          Function: {},
        },
      },
    ],
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
  },
}
