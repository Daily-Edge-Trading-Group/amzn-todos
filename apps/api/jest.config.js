/** @type {import('jest').Config} */
module.exports = {
  displayName: 'api',
  testEnvironment: 'node',
  rootDir: '.',
  passWithNoTests: true,
  testMatch: ['<rootDir>/src/**/*.test.ts', '<rootDir>/src/validation/**/*.test.ts'],
  setupFilesAfterEnv: ['<rootDir>/src/validation/setup.ts'],
  moduleFileExtensions: ['ts', 'js', 'json'],
  extensionsToTreatAsEsm: [],
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        useESM: false,
        tsconfig: '<rootDir>/tsconfig.json',
        isolatedModules: true,
      },
    ],
  },
  moduleNameMapper: {
    '^@todo-app/contracts$': '<rootDir>/../../libs/contracts/src',
    '^@todo-app/contracts/(.*)$': '<rootDir>/../../libs/contracts/src/$1',
    '^@todo-app/guards$': '<rootDir>/../../libs/guards/src',
    '^@todo-app/guards/(.*)$': '<rootDir>/../../libs/guards/src/$1',
  },
}
