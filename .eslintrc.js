module.exports = {
  parser: 'vue-eslint-parser',
  root: true,
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  plugins: ['simple-import-sort', 'import'],
  extends: [
    // 'plugin:vue/essential',
    'plugin:vue/strongly-recommended',
    'plugin:import/typescript',
    'eslint:recommended',
    '@vue/typescript/recommended',
    '@vue/prettier/@typescript-eslint',
  ],
  parserOptions: {
    parser: '@typescript-eslint/parser',
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  rules: {
    // "no-console": process.env.NODE_ENV === "production" ? "error" : "off",
    // "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off"
    indent: [
      'error',
      2,
      {
        SwitchCase: 1,
      },
    ],
    'linebreak-style': ['error', 'unix'],
    quotes: ['error', 'single'],
    semi: ['error', 'always'],
    'no-unused-vars': 'off',
    'space-before-function-paren': 'off',
    // 'block-spacing': 'off',
    'spaced-comment': 'off',
    'comma-dangle': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    'no-useless-constructor': 'off',
    '@typescript-eslint/no-useless-constructor': 'error',
    // 'no-eval': 'off',
    // 'computed-property-even-spacing': 'off',
    // 'standard/computed-property-even-spacing': 'off'
    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',

    'import/order': 'off',
    'import/first': 'error',
    'import/newline-after-import': 'error',
    'import/no-duplicates': 'error',

    'vue/attributes-order': 'error',
    'vue/valid-v-slot': [
      'error',
      {
        allowModifiers: true,
      },
    ],
    'vue/no-unused-vars': 'warn',
    'vue/no-mutating-props': 'off',
    'vue/custom-event-name-casing': 'off',
  },
};
