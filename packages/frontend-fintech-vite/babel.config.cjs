const styleXPlugin = require("@stylexjs/babel-plugin");

const plugins = ["relay"];

plugins.push([
  styleXPlugin,
  {
    dev: true,
    test: false,
    unstable_moduleResolution: {
      type: "commonJS",
      rootDir: __dirname,
    },
  },
]);

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
    [
      "babel-preset-vite",
      {
        env: true,
        glob: false,
      },
    ],
  ],
  plugins,
};
