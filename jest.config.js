module.exports = {
    testEnvironment: "node",
    moduleFileExtensions: ["js", "jsx"],
    testMatch: ["**/?(*.)+(spec|test).[jt]s?(x)"],
    transform: {
        "^.+\\.(js|jsx)$": "babel-jest",
    },
};
