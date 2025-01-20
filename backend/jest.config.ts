import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  verbose: true,
  transform: {
    "^.+\\.ts?$": "ts-jest",
  },
  clearMocks: true,

  // Indicates whether the coverage information should be collected while executing the test
  collectCoverage: true,

  // An array of glob patterns indicating a set of files for which coverage information should be collected
  collectCoverageFrom: [
    "src/**/*.ts",
    "!src/models/*", // TODO: Need to fix this why models are not getting covered
  ],

  // The directory where Jest should output its coverage files
  coverageDirectory: "coverage",

  // An array of regexp pattern strings used to skip coverage collection
  coveragePathIgnorePatterns: [
    "./node_modules/",
    "<rootDir>/src/server.ts",
    "<rootDir>/src/utils/logger.ts",
    "<rootDir>/src/utils/context.ts",
    "<rootDir>/src/utils/metrics.ts",
  ],

  // Indicates which provider should be used to instrument code for coverage
  coverageProvider: "v8",

  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
  moduleDirectories: ["node_modules", "<rootDir>"],

  moduleNameMapper: {
    "^@/(.*)": "<rootDir>/$1",
    "^@src/(.*)": "<rootDir>/src/$1",
    "^@controllers/(.*)": "<rootDir>/src/controllers/$1",
    "^@service/(.*)": "<rootDir>/src/service/$1",
    "^@services/(.*)": "<rootDir>/src/services/$1",
    "^@models/(.*)": "<rootDir>/src/models/$1",
    "^@validators/(.*)": "<rootDir>/src/validators/$1",
    "^@utils/(.*)": "<rootDir>/src/utils/$1",
    "^@handlers/(.*)": "<rootDir>/src/handlers/$1",
    "^@middlewares/(.*)": "<rootDir>/src/middlwares/$1",
  },

  testMatch: [
    // "**/__tests__/**/*.[jt]s?(x)",
    // "**/__tests__/**/*.ts",
    "**/?(*.)+(spec|test).[t]s?(x)",
  ],

  // An array of regexp pattern strings that are matched against all test paths, matched tests are skipped
  testPathIgnorePatterns: [
    "./node_modules/",
    "<rootDir>/src/utils/logger.ts",
    "<rootDir>/src/utils/context.ts",
  ],
};

export default config;
