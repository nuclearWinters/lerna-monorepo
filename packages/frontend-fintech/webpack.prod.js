const path = require("path");
const StylexPlugin = require("@stylexjs/webpack-plugin");
const fs = require("fs");
const webpack = require("webpack");

process.env.NODE_ENV = "production";

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = (relativePath) => path.resolve(appDirectory, relativePath);

module.exports = {
  mode: "production",
  bail: true,
  output: {
    clean: true,
    path: resolveApp("build"),
    pathinfo: false,
    filename: "static/js/[name].[contenthash:8].js",
    publicPath: "/",
    assetModuleFilename: "static/media/[name].[hash][ext]",
    chunkFilename: "static/js/[name].[contenthash:8].chunk.js",
    devtoolModuleFilenameTemplate: (info) =>
      path
        .relative(resolveApp("src"), info.absoluteResourcePath)
        .replace(/\\/g, "/"),
  },
  module: {
    rules: [
      {
        enforce: "pre",
        exclude: /@babel(?:\/|\\{1,2})runtime/,
        test: /\.(js|mjs|jsx|ts|tsx|css)$/,
        loader: "source-map-loader",
      },
      {
        test: /\.(js|ts)x?$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
    ],
  },
  devtool: "source-map",
  plugins: [
    new webpack.EnvironmentPlugin({
      AUTH_API: "https://auth.relay-graphql-monorepo.com/graphql",
      FINTECH_API: "https://fintech.relay-graphql-monorepo.com/graphql",
    }),
    new StylexPlugin({
      filename: "static/css/styles.[contenthash].css",
      dev: false,
      runtimeInjection: false,
      classNamePrefix: "x",
      unstable_moduleResolution: {
        type: "commonJS",
        rootDir: __dirname,
      },
    }),
  ],
};
