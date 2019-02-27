const webpack = require("webpack");
const merge = require('webpack-merge');
const devConfig = require('./development.webpack.config');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = (env) => merge(devConfig(env), {
    mode: 'development',
    plugins: [
        new BundleAnalyzerPlugin(),
    ]
});