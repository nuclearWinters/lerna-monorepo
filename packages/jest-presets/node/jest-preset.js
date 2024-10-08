const tsPreset = require("ts-jest/jest-preset")
const shelfMongo = require("@shelf/jest-mongodb/jest-preset")

module.exports = {
  ...tsPreset,
  ...shelfMongo,
  roots: ["<rootDir>"],
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  modulePathIgnorePatterns: [
    "<rootDir>/test/__fixtures__",
    "<rootDir>/node_modules",
    "<rootDir>/dist",
  ],
};
