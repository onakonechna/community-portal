const path = require("path");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");

let webpack = require("webpack");
let apiHost = "'http://localhost:3000'";
let frontendHost = "'http://localhost:8080'";
let reactMode = "development";
let public = '';

switch(process.env.STAGE) {
    case "production":
        apiHost = "'https://api.opensource.magento.com'";
        frontendHost = "'https://opensource.magento.com'";
        reactMode = "production"
        break;
    case "qa":
        apiHost = "'https://api.opensource.engcom.magento.com'";
        frontendHost = "'https://opensource.engcom.magento.com'";
        break;  
    case "dev":
        apiHost = process.env.ENDPOINT_URL ? 
            JSON.stringify(process.env.ENDPOINT_URL) : 
            JSON.stringify('https://dev.api.opensource.engcom.magento.com');
        frontendHost = "'https://dev.opensource.engcom.magento.com'";
        break;    
    case "local":
        apiHost = JSON.stringify('http://localhost:3000')
        frontendHost = JSON.stringify('http://localhost:8080');
        break;
    case "custom":
        apiHost = process.env.ENDPOINT_URL ? 
            JSON.stringify(process.env.ENDPOINT_URL) : 
            JSON.stringify('http://localhost');
        frontendHost = process.env.FRONTEND 
            ? JSON.stringify(process.env.FRONTEND) 
            : JSON.stringify('http://localhost:8080');
        break;  
}

module.exports = {
    entry: "./src/index.tsx",
    output: {
        filename: "bundle.js",
        path: path.resolve(__dirname + "/public/dist"),
        publicPath: "/dist/"
    },
    plugins: [
        new webpack.DefinePlugin({
            API_ENDPOINT: apiHost,
            __FRONTEND__: frontendHost,
            NODE_ENV: JSON.stringify(reactMode),
            GITHUB_CLIENT_ID: JSON.stringify(process.env.GITHUB_CLIENT_ID),
            PUBLIC_URL: JSON.stringify(public)
          }),
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
            { enforce: "pre", test: /\.js$/, loader: "source-map-loader" },
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
