module.exports = {
    preset: "ts-jest",
    testEnvironment: "jsdom",
    testMatch: ["**/__tests__/**/*.test.ts", "**/__tests__/**/*.test.tsx"],
    moduleNameMapper: {
        "\\.(css|less|scss)$": "<rootDir>/src/__mocks__/styleMock.ts"
    }
};
