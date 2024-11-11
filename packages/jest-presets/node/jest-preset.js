const shelfMongo = require("@shelf/jest-mongodb/jest-preset");

module.exports = {
  preset: "ts-jest/presets/default-esm",
  ...shelfMongo,
  roots: ["<rootDir>"],
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        isolatedModules: true,
      },
    ],
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json"],
  modulePathIgnorePatterns: [
    "<rootDir>/test/__fixtures__",
    "<rootDir>/node_modules",
    "<rootDir>/build",
  ],
};
