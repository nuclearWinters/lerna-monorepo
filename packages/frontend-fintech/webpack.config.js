const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");
const StylexPlugin = require("@stylexjs/webpack-plugin");
const ESLintPlugin = require("eslint-webpack-plugin");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const fs = require("fs");

const isDevelopment = process.env.NODE_ENV !== "production";
const isProduction = !isDevelopment;
const shouldUseSourceMap = process.env.GENERATE_SOURCEMAP !== "false";
const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = (relativePath) => path.resolve(appDirectory, relativePath);

module.exports = {
  target: ["browserslist"],
  stats: "errors-warnings",
  mode: isDevelopment ? "development" : "production",
  bail: isProduction,
  entry: resolveApp("src/index.tsx"),
  output: {
    clean: true,
    path: resolveApp("build"),
    pathinfo: isDevelopment,
    filename: isProduction
      ? "static/js/[name].[contenthash:8].js"
      : isDevelopment && "static/js/bundle.js",
    publicPath: "/",
    assetModuleFilename: "static/media/[name].[hash][ext]",
    assetModuleFilename: "static/media/[name].[hash][ext]",
    chunkFilename: isProduction
      ? "static/js/[name].[contenthash:8].chunk.js"
      : isDevelopment && "static/js/[name].chunk.js",
    devtoolModuleFilenameTemplate: isProduction
      ? (info) =>
          path
            .relative(resolveApp("src"), info.absoluteResourcePath)
            .replace(/\\/g, "/")
      : isDevelopment &&
        ((info) => path.resolve(info.absoluteResourcePath).replace(/\\/g, "/")),
  },
  devtool: isProduction
    ? shouldUseSourceMap
      ? "source-map"
      : false
    : isDevelopment && "cheap-module-source-map",
  module: {
    strictExportPresence: true,
    rules: [
      shouldUseSourceMap && {
        enforce: "pre",
        exclude: /@babel(?:\/|\\{1,2})runtime/,
        test: /\.(js|mjs|jsx|ts|tsx|css)$/,
        loader: require.resolve("source-map-loader"),
      },
      {
        test: /\.(js|ts)x?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "babel-loader",
          },
        ],
      },
      {
        test: /\.png/,
        type: "asset/resource",
      },
    ],
  },
  resolve: {
    modules: [path.resolve(__dirname, "src"), "node_modules"],
    extensions: [".tsx", ".ts", ".jsx", ".js"],
  },
  plugins: [
    new ForkTsCheckerWebpackPlugin(),
    new ESLintPlugin({
      extensions: ["js", "mjs", "jsx", "ts", "tsx"],
    }),
    new StylexPlugin({
      filename: "static/css/styles.[contenthash].css",
      dev: isDevelopment,
      runtimeInjection: false,
      classNamePrefix: "x",
      unstable_moduleResolution: {
        type: "commonJS",
        rootDir: __dirname,
      },
    }),
    new webpack.EnvironmentPlugin({
      API_GATEWAY: null,
      REALTIME_GATEWAY: null,
    }),
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: resolveApp("public/index.html"),
    }),
  ],
  devServer: {
    port: 8000,
    host: "0.0.0.0",
    historyApiFallback: true,
    hot: true,
  },
};
