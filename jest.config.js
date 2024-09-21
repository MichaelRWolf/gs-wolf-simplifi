// jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.ts$': ['ts-jest', {tsconfig: 'tsconfig.json'}],  // Move ts-jest config here
  },

  // globals: {
  //   'ts-jest': {
  //     tsconfig: 'tsconfig.json', // Ensures ES5 targeting
  //   },
  // Specify test file patterns and ensure both src and test files are compiled
  testMatch: ['**/test/**/*.test.ts'],
  setupFilesAfterEnv: ['./src/Transaction.ts'],  // Load Transaction class globally before tests run

};
