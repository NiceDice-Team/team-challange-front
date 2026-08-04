import nextJest from "next/jest";
import type { Config } from "jest";

const createJestConfig = nextJest({
  dir: "./",
});

const customJestConfig: Config = {
  testEnvironment: "jest-environment-jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "^@/components/(.*)$": "<rootDir>/src/components/$1",
    "^@/services/(.*)$": "<rootDir>/src/services/$1",
    "^@/utils/(.*)$": "<rootDir>/src/utils/$1",
    "^@/hooks/(.*)$": "<rootDir>/src/hooks/$1",
    "^@/lib/(.*)$": "<rootDir>/src/lib/$1",
  },
  testPathIgnorePatterns: [
    "<rootDir>/.next/",
    "<rootDir>/node_modules/",
    "<rootDir>/tests/",
  ],
  modulePathIgnorePatterns: ["<rootDir>/.next/"],
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    "!src/**/*.test.{ts,tsx}",
    "!src/**/*.spec.{ts,tsx}",
    "!src/**/*.d.ts",
    "!src/**/index.ts",
    "!src/app/layout.{ts,tsx}",
    "!src/app/not-found.{ts,tsx}",
    "!src/middleware.ts",
  ],
  coverageReporters: ["text", "lcov", "html"],
  testMatch: [
    "<rootDir>/src/**/__tests__/**/*.{ts,tsx}",
    "<rootDir>/src/**/*.(test|spec).{ts,tsx}",
  ],
};

export default createJestConfig(customJestConfig);
