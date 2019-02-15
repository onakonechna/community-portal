const merge = require('webpack-merge');
const baseConfig = require('./base.webpack.config');
const path = require("path");
const webpack = require("webpack");
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = (env) => merge(baseConfig(env), {
    mode: 'development',
    plugins: [
        new HtmlWebpackPlugin({
            template: 'src/assets/index.html',
            filename: '../index.html',
            alwaysWriteToDisk: true,
        }),
        new HtmlWebpackHarddiskPlugin(),
    ],
    devServer: {
        contentBase: "public",
        compress: false,
        historyApiFallback: true
    }
});