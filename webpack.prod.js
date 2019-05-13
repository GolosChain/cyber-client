const path = require('path');

module.exports = {
  entry: {
    cyberway: './src/index.js',
  },
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'babel-loader',
      },
    ],
  },
  resolve: {
    extensions: ['.js'],
  },
  output: {
    filename: x => x.chunk.name.replace('_', '-') + '.js',
    library: '[name]',
    path: path.resolve(__dirname, 'dist-web'),
  },
};
