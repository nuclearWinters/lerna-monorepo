const path = require("path");
const webpack = require("webpack");
const StylexPlugin = require("@stylexjs/webpack-plugin");
const fs = require("fs");

process.env.NODE_ENV = "development";

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = (relativePath) => path.resolve(appDirectory, relativePath);
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");

module.exports = {
  mode: "development",
  bail: false,
  output: {
    clean: true,
    path: resolveApp("build"),
    pathinfo: true,
    filename: "static/js/bundle.js",
    publicPath: "/",
    assetModuleFilename: "static/media/[name].[hash][ext]",
    assetModuleFilename: "static/media/[name].[hash][ext]",
    chunkFilename: "static/js/[name].chunk.js",
    devtoolModuleFilenameTemplate: (info) =>
      path.resolve(info.absoluteResourcePath).replace(/\\/g, "/"),
  },
  devtool: "cheap-module-source-map",
  module: {
    rules: [
      {
        test: /\.(js|ts)x?$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            plugins: ["react-refresh/babel"],
          },
        },
      },
    ],
  },
  resolve: {
    modules: [path.resolve(__dirname, "src"), "node_modules"],
  },
  plugins: [
    new webpack.EnvironmentPlugin({
      AUTH_API: null,
      FINTECH_API: null,
    }),
    new StylexPlugin({
      filename: "static/css/styles.[contenthash].css",
      dev: true,
      runtimeInjection: false,
      classNamePrefix: "x",
      unstable_moduleResolution: {
        type: "commonJS",
        rootDir: __dirname,
      },
    }),
    new ReactRefreshWebpackPlugin(),
  ],
  devServer: {
    port: 8000,
    host: "0.0.0.0",
    historyApiFallback: true,
    hot: true,
    client: { overlay: false },
  },
};
