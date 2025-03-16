module.exports = {
    extends: [
      'plugin:@typescript-eslint/recommended',
      'eslint:recommended',
    ],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off', // Permite el uso de any
    },
  };