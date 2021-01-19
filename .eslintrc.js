module.exports = {
    env: {
        browser: true,
        es2021: true,
        jest: true
    },
    plugins: [
        'react',
        'react-hooks'
    ],
    extends: [
        'standard',
        'eslint:recommended',
        'plugin:react/recommended'
    ],
    parser: 'babel-eslint',
    parserOptions: {
        ecmaVersion: 12,
        sourceType: 'module',
        ecmaFeatures: {
            jsx: true
        }
    },
    globals: {
        cy: true
    },
    settings: {
        react: {
            version: 'detect'
        }
    },
    rules: {
        'no-undef': 'error',
        'block-spacing': [ 'warn', 'always' ],
        'array-bracket-spacing': [ 'warn', 'always' ],
        'space-in-parens': [ 'warn', 'always' ],
        indent: [ 'warn', 4, {
            MemberExpression: 1,
            ignoredNodes: [ 'ConditionalExpression' ]
        } ],
        'object-curly-spacing': [ 'warn', 'always' ],
        'no-unused-vars': 'error',
        'max-len': [ 'warn', { code: 120 } ],
        'space-before-function-paren': [ 'warn', 'never' ],
        'operator-linebreak': [
            'warn',
            'before',
            { overrides: { '=': 'after' } }
        ],
        'no-useless-constructor': 'off',
        'max-depth': [ 'warn', { max: 2 } ],
        'multiline-ternary': [ 'warn', 'always-multiline' ],
        'array-element-newline': [ 'warn', 'consistent' ],
        'react-hooks/rules-of-hooks': 'error',
        'react-hooks/exhaustive-deps': 'warn'
    }
}
