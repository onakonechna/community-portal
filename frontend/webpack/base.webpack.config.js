const path = require("path");
const dotenv = require('dotenv');
const fs = require('fs');
const webpack = require("webpack");
const HtmlWebpackChangeAssetsExtensionPlugin = require('html-webpack-change-assets-extension-plugin');

module.exports = env => {
    const currentPath = path.join(__dirname);
    const baseEnvPath = currentPath + '/../.env';
    const currentEnvPath = baseEnvPath + '.' + env;
    const finalPath = fs.existsSync(currentEnvPath) ? currentEnvPath : baseEnvPath;
    const fileEnv = dotenv.config({ path: finalPath }).parsed;
    const ENV_KEYS = Object.keys(fileEnv).reduce((prev, next) => {
        prev[`process.env.${next}`] = JSON.stringify(fileEnv[next]);
        return prev;
    }, {});

    return {
        entry: "./src/index.tsx",
        output: {
            filename: "bundle.js",
            path: path.resolve(__dirname + "/../public/dist"),
            publicPath: "/dist/"
        },
        resolve: {
            extensions: [".ts", ".tsx", ".js", ".json"]
        },
        plugins: [
            new webpack.DefinePlugin(ENV_KEYS),
        ],
        module: {
            rules: [
                {
                    test: /\.tsx?$/, loader: "awesome-typescript-loader"
                },
                {
                    enforce: "pre",
                    test: /\.js$/,
                    loader: "source-map-loader",
                    exclude: [
                        /node_modules\/react-wysiwyg-typescript/
                    ]
                },
                {
                    test:/\.css$/,
                    use:['style-loader','css-loader']
                },
                {
                    test: /\.svg$/,
                    loader: 'svg-react-loader'
                },
                {
                    test: /\.(jpe?g|gif|png|svg|woff|ttf|wav|mp3)$/,
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]',
                        outputPath: 'static/images/'
                    }
                }
            ]
        }
    }
};
