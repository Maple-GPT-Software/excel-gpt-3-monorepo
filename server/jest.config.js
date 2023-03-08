module.exports = {
  transform: {
    '^.+\\.(ts|tsx)?$': '@swc/jest',
  },
  moduleNameMapper: {
    '@src/(.*)': '<rootDir>/src/$1',
  },
  testMatch: ['**/*.test.ts'],
};
