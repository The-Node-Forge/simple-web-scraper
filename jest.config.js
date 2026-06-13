module.exports = {
  preset: 'ts-jest', // Use ts-jest to handle TypeScript files
  testEnvironment: 'node', // Use Node.js environment for tests
  moduleFileExtensions: ['ts', 'js'], // Recognize TypeScript and JavaScript files
  testMatch: ['**/tests/**/*.test.ts'], // Match test files
  verbose: true, // Show detailed test results
  setupFiles: ['<rootDir>/jest.setup.js'], // Setup file for polyfills (runs before test environment)
  transform: {
    '^.+\\.ts$': [
      'ts-jest',
      {
        tsconfig: {
          isolatedModules: true, // Fix ts-jest warning about hybrid module kind
        },
        diagnostics: {
          ignoreCodes: [151002], // Suppress TS151002 warning
        },
      },
    ],
  },
};
