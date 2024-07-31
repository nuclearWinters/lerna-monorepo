const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const fs = require("fs");

const resolveApp = (relativePath) => path.resolve(appDirectory, relativePath);
const appDirectory = fs.realpathSync(process.cwd());
//Recommended for performance
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

module.exports = {
    //target: ["browserslist"],
    stats: "errors-warnings",
    entry: resolveApp("src/index.tsx"),
    resolve: {
        extensions: [".ts", ".tsx", ".js"],
    },
    module: {
        strictExportPresence: true,
        rules: [
            {
                enforce: "pre",
                exclude: /@babel(?:\/|\\{1,2})runtime/,
                test: /\.(js|mjs|jsx|ts|tsx|css)$/,
                loader: require.resolve("source-map-loader"),
            },
            {
                test: /\.(js|ts)x?$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                },
            },
            {
                test: /\.png/,
                type: "asset/resource",
            },
        ],
    },
    plugins: [
        new ForkTsCheckerWebpackPlugin(),
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