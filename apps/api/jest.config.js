/** @type {import('jest').Config} */
module.exports = {
  displayName: 'api',
  preset: 'ts-jest',
  testEnvironment: 'node',
  rootDir: '.',
  testMatch: ['<rootDir>/src/**/*.test.ts'],
  moduleFileExtensions: ['ts', 'js', 'json'],
  transform: {
    '^.+\\.ts$': [
      'ts-jest',
      {
        tsconfig: '<rootDir>/tsconfig.json',
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
