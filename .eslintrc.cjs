/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');

module.exports = {
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: ['./tsconfig.json', './tsconfig.node.json'],
        tsconfigRootDir: __dirname,
    },
    root: true,
    env: { browser: true, es2020: true },
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended-type-checked',
        'plugin:@typescript-eslint/stylistic-type-checked',
        'plugin:react-hooks/recommended',
        'plugin:react/recommended',
        'plugin:react/jsx-runtime',
        'plugin:@tanstack/eslint-plugin-query/recommended',
        'prettier',
    ],
    ignorePatterns: ['dist', '.eslintrc.cjs'],
    parser: '@typescript-eslint/parser',
    plugins: ['react-refresh'],
    settings: {
        react: {
            // Nói eslint-plugin-react tự động biết version của React.
            version: 'detect',
        },
        // Nói ESLint cách xử lý các import
        'import/resolver': {
            node: {
                paths: [path.resolve(__dirname)],
                extensions: ['.js', '.jsx', '.ts', '.tsx'],
            },
        },
    },
    rules: {
        'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
        indent: [0, 4, { SwitchCase: 1 }],
        'max-len': [
            'warn',
            {
                code: 120,
            },
        ],
        'comma-dangle': ['warn', 'never'],
        'require-jsdoc': 0,
        quotes: ['off', 'double'],
        'comma-dangle': ['off'],
        'no-trailing-spaces': [
            'off',
            {
                skipBlankLines: true,
            },
        ],
        '@typescript-eslint/no-unused-vars': ['warn'],
        '@typescript-eslint/prefer-nullish-coalescing': ['off'],
        '@typescript-eslint/no-misused-promises': ['off'],
        'react/display-name': ['off'],
    },
};
