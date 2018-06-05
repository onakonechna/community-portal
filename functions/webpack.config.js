const path = require('path');
const slsw = require('serverless-webpack');

const IS_OFFLINE = process.env.IS_OFFLINE;

const config = {
  devtool: 'source-map',
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
  module: {
    loaders: [
      { test: /\.ts(x?)$/, loader: 'ts-loader' },
    ],
  },
};

// serverless-offline does not support packaging individually
// config object requires entry to be defined
if (IS_OFFLINE === true){
  const entries = {};

  Object.keys(slsw.lib.entries).forEach(key => (
    entries[key] = ['./source-map-install.js', slsw.lib.entries[key]]
  ));

  config.entry = entries
}

module.exports = config
