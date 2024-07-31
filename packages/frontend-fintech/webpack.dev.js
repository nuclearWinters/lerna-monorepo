const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");
const StylexPlugin = require("@stylexjs/webpack-plugin");
const fs = require("fs");

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = (relativePath) => path.resolve(appDirectory, relativePath);
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

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
        devtoolModuleFilenameTemplate: (info) => path.resolve(info.absoluteResourcePath).replace(/\\/g, "/"),
    },
    devtool: "cheap-module-source-map",
    resolve: {
        modules: [path.resolve(__dirname, "src"), "node_modules"],
        extensions: [".tsx", ".ts", ".jsx", ".js"],
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                AUTH_API: null,
                FINTECH_API: null,
            }
        }),
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
        new HtmlWebpackPlugin({
            filename: "index.html",
            template: resolveApp("public/index.html"),
        }),
        new ReactRefreshWebpackPlugin(),
    ],
    devServer: {
        port: 8000,
        host: "0.0.0.0",
        historyApiFallback: true,
        hot: true,
    },
};
