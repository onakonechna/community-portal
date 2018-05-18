var path = require('path');
module.exports = {
    entry: './src/index.js',
    output: {
        path: __dirname,
        filename: 'bundle.js'
    },
    module: {
        loaders: [
            { 
                // test: path.join(__dirname, 'es6'),
                include: path.resolve(__dirname, './src'),
                exclude: /node_modules/,
                loader: 'babel-loader',
                query: {
                    presets:['react'],
                    plugins: [
                      
                    ]
                },
            }
        ]
    }
};