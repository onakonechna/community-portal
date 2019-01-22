const path = require("path");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CompressionPlugin = require("compression-webpack-plugin");
const HtmlWebpackChangeAssetsExtensionPlugin = require('html-webpack-change-assets-extension-plugin')


let webpack = require("webpack");
let apiHost = "'http://localhost:3000'";
let frontendHost = "'http://localhost:8080'";
let reactMode = "development";
let githubClientId = '';
let public = '';

switch(process.env.STAGE) {
    case "production":
        apiHost = JSON.stringify('https://api.opensource.magento.com');
        frontendHost = JSON.stringify('https://opensource.magento.com');
        reactMode = "production";
        githubClientId = JSON.stringify(process.env.GITHUB_CLIENT_ID);
        break;
    case "qa":
        apiHost = JSON.stringify('https://api.opensource.engcom.magento.com');
        frontendHost = JSON.stringify('https://opensource.engcom.magento.com');
        reactMode = "production";
        githubClientId = JSON.stringify(process.env.STAGING_GITHUB_CLIENT_ID);
        break;
    case "local":
        apiHost = JSON.stringify('http://localhost:3000');
        frontendHost = JSON.stringify('http://localhost:8080');
        reactMode = "production";
        githubClientId = JSON.stringify(process.env.GITHUB_CLIENT_ID);
        break;
}

module.exports = {
    entry: "./src/index.tsx",
    mode: 'production',
    output: {
        filename: "[name].bundle.[chunkhash].js",
        path: path.resolve(__dirname + "/public/dist"),
        publicPath: "/dist/"
    },
    plugins: [
        new webpack.DefinePlugin({
            API_ENDPOINT: apiHost,
            __FRONTEND__: frontendHost,
            NODE_ENV: JSON.stringify(reactMode),
            GITHUB_CLIENT_ID: githubClientId,
            PUBLIC_URL: JSON.stringify(public)
          }),
        new HtmlWebpackPlugin({
            filename: '../index.html',
            template: 'src/assets/index.template.html',
            jsExtension: '.gz'
        }),
        new UglifyJsPlugin(),
        new CompressionPlugin(),
        new HtmlWebpackChangeAssetsExtensionPlugin()
    ],

    devServer: {
        contentBase: "public",
        historyApiFallback: true,
    },

    // Enable sourcemaps for debugging webpack's output.
    // Enabled debugging with React Dev Tool
    // devtool: "eval",

    resolve: {
        // Add '.ts' and '.tsx' as resolvable extensions.
        extensions: [".ts", ".tsx", ".js", ".json"]
    },

    module: {
        rules: [
            // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
            { test: /\.tsx?$/, loader: "awesome-typescript-loader" },
            // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
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
    },

    optimization: {
        minimize: true,
        minimizer: [new UglifyJsPlugin()]
    },

    // When importing a module whose path matches one of the following, just
    // assume a corresponding global variable exists and use that instead.
    // This is important because it allows us to avoid bundling all of our
    // dependencies, which allows browsers to cache those libraries between builds.
    // externals: {
    //     "react-dom": "ReactDOM",
    //     "jss": "jss",
    // }
};
