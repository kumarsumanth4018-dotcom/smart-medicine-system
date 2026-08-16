import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'

export default [
  { ignores: ['dist'] },
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true, checkJS: false },
      ],
      // Catch unused variables and imports at lint time
      // Note: scoped to JS utilities only — JSX components used in JSX markup
      // appear "unused" to basic AST analysis and would generate false positives.
      'no-unused-vars': ['warn', {
        vars: 'all',
        args: 'after-used',
        ignoreRestSiblings: true,
        varsIgnorePattern: '^_',
        argsIgnorePattern: '^_',
      }],
    },
  },
  // Disable no-unused-vars for JSX files: components referenced in JSX
  // markup look "unused" to ESLint's basic var-tracking — only TypeScript
  // or a dedicated JSX plugin can resolve JSX usage correctly.
  // We keep it enabled for pure .js utility, hook, service, and config files.
  {
    files: ['**/*.jsx'],
    rules: {
      'no-unused-vars': 'off',
    },
  },
  // Context files intentionally co-export a Provider component and a hook.
  // This is a recognised React pattern — suppress the fast-refresh warning.
  {
    files: ['src/contexts/**/*.{js,jsx}'],
    rules: {
      'react-refresh/only-export-components': 'off',
    },
  },
]
