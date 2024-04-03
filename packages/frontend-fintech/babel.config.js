const styleXPlugin = require("@stylexjs/babel-plugin");

const isDevelopment = process.env.NODE_ENV !== "production";

const plugins = ["relay"];

if (isDevelopment) {
  plugins.push([
    styleXPlugin,
    {
      dev: true,
      // Set this to true for snapshot testing
      // default: false
      test: false,
      // Required for CSS variable support
      unstable_moduleResolution: {
        // type: 'commonJS' | 'haste'
        // default: 'commonJS'
        type: "commonJS",
        // The absolute path to the root directory of your project
        rootDir: __dirname,
      },
    },
  ]);
}

module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        targets: { esmodules: true },
      },
    ],
    "@babel/preset-typescript",
    ["@babel/preset-react", { runtime: "automatic" }],
  ],
  plugins,
};
