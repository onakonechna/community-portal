const path = require('path');
const slsw = require('serverless-webpack');
const externals = require('webpack-node-externals');

module.exports = {
  entry: slsw.lib.entries,
  mode: 'development',
  resolve: {
    extensions: [
      '.js',
      '.jsx',
      '.json',
      '.ts',
      '.tsx'
    ]
  },
  output: {
    libraryTarget: 'commonjs',
    path: path.join(__dirname, '.webpack'),
    filename: '[name].js',
  },
  target: 'node',
  externals: [externals()],
  module: {
    rules: [
      { test: /\.ts(x?)$/, loader: 'ts-loader' },
    ],
  },
};
