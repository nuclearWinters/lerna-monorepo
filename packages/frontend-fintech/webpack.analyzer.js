const path = require("path");
const StylexPlugin = require("@stylexjs/webpack-plugin");
const fs = require("fs");
const BundleAnalyzerPlugin =
  require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

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
    new BundleAnalyzerPlugin(),
  ],
};
