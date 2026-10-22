module.exports = {
  preset: '@react-native/jest-preset',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testPathIgnorePatterns: ['/node_modules/', '/shopai-backend/'],
  collectCoverageFrom: [
    'src/utils/**/*.ts',
    'src/store/useCartStore.ts',
    '!src/**/*.d.ts',
  ],
  coverageThreshold: {
    './src/utils/formatCurrency.ts': { statements: 100, branches: 100, functions: 100, lines: 100 },
    './src/store/useCartStore.ts': { statements: 75, branches: 60, functions: 75, lines: 75 },
  },
};
