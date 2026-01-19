export default {
  testEnvironment: 'node',
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'src/**/*.{js,ts}',
    '!src/**/*.test.{js,ts}',
    '!src/**/*.spec.{js,ts}',
    '!src/index.js',
  ],
  coverageReporters: ['json', 'json-summary', 'lcov', 'text', 'clover'],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
  testMatch: [
    '**/__tests__/**/*.[jt]s?(x)',
    '**/tests/unit/**/*.[jt]s?(x)',
    '**/?(*.)+(spec|test).[jt]s?(x)',
  ],
  testPathIgnorePatterns: [
    '/node_modules/',
    '/tests/e2e/',
    '/tests/accessibility/',
    '/tests/seed\.spec\.ts',
    '/specs/',
    '\.spec\.js$', // Exclude all .spec.js files (Playwright convention)
    '/tests/integration/arog-cli.test.js', // ESM test - requires experimental support
  ],
  moduleFileExtensions: ['js', 'json', 'jsx', 'ts', 'tsx', 'node'],
  verbose: true,
};
