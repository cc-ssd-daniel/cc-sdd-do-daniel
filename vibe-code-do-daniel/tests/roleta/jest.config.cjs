const path = require('path');

module.exports = {
  rootDir: path.resolve(__dirname, '../..'),
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/src/minigames/roleta', '<rootDir>/src/storage', '<rootDir>/tests/roleta'],
  testMatch: ['**/*.test.js'],
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
  transform: {
    '^.+\\.[jt]sx?$': require.resolve('react-scripts/config/jest/babelTransform'),
    '^.+\\.(svg|png|jpg|jpeg|gif|webp)$': require.resolve('react-scripts/config/jest/fileTransform'),
  },
  moduleNameMapper: { '\\.(css|less|scss)$': require.resolve('identity-obj-proxy') },
  clearMocks: true,
  cacheDirectory: '<rootDir>/node_modules/.cache/roleta-jest',
  watchman: false,
  haste: { forceNodeFilesystemAPI: true },
};
