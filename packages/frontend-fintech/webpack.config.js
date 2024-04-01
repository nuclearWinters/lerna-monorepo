const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");
const StylexPlugin = require("@stylexjs/webpack-plugin");

const isDevelopment = process.env.NODE_ENV !== "production";
const isProduction = !isDevelopment;
const shouldUseSourceMap = process.env.GENERATE_SOURCEMAP !== "false";

module.exports = {
  mode: isDevelopment ? "development" : "production",
  entry: "./src/index.tsx",
  output: {
    clean: true,
    path: path.resolve(__dirname, "./build"),
    filename: isProduction
      ? "static/js/[name].[contenthash:8].js"
      : isDevelopment && "static/js/bundle.js",
    publicPath: "/",
    assetModuleFilename: "static/media/[name].[hash][ext]",
  },
  devtool: isProduction
    ? shouldUseSourceMap
      ? "source-map"
      : false
    : isDevelopment && "cheap-module-source-map",
  module: {
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
      template: path.resolve(__dirname, "public", "index.html"),
    }),
  ],
  devServer: {
    port: 8000,
    host: "0.0.0.0",
    historyApiFallback: true,
    hot: true,
  },
};
