const path = require('path');

module.exports = {
    entry: {
        cyberway: './src/index.js',
    },
    devtool: 'inline-source-map',
    mode: 'development',
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
        filename: x => x.chunk.name.replace('_', '-') + '-debug.js',
        library: '[name]',
        path: path.resolve(__dirname, 'dist-web', 'debug'),
    }
};
