const merge = require('webpack-merge');
const baseConfig = require('./base.webpack.config');
const path = require("path");
const webpack = require("webpack");
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin');
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CompressionPlugin = require("compression-webpack-plugin");
const HtmlWebpackChangeAssetsExtensionPlugin = require('html-webpack-change-assets-extension-plugin')

module.exports = (env) => merge(baseConfig(env), {
    mode: 'production',
    plugins: [
        new HtmlWebpackPlugin({
            template: 'src/assets/index.html',
            filename: '../index.html',
            alwaysWriteToDisk: true,
            jsExtension: '.gz'
        }),
        new HtmlWebpackHarddiskPlugin(),
        new UglifyJsPlugin(),
        new CompressionPlugin(),
        new HtmlWebpackChangeAssetsExtensionPlugin()
    ],
    optimization: {
        minimize: true,
        minimizer: [new UglifyJsPlugin()]
    },
});