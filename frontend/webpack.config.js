const path = require("path");

let webpack = require("webpack");
let apiHost = "'http://localhost:3000'";
let frontendHost = "'http://localhost:8080'";
let reactMode = "development";

switch(process.env.STAGE) {
    case "production":
        apiHost = "'https://api.opensource.magento.com/'";
        frontendHost = "'https://opensource.magento.com/'";
        reactMode = "production"
        break;
    case "qa":
        apiHost = "'https://api.opensource.engcom.magento.com/'";
        frontendHost = "'https://opensource.engcom.magento.com/'";
        break;  
    case "dev":
        apiHost = "'https://api.dev.opensource.engcom.magento.com/'";
        frontendHost = "'https://dev.opensource.engcom.magento.com/'";
        break;    
    case "local":
        apiHost = "'http://localhost:3000'"
        frontendHost = "'http://localhost:8080'";
        break;
}

console.log(process.env.STAGE);
console.log(apiHost);
console.log(process.env.GIT_ID);

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
            GIT_ID: JSON.stringify(process.env.GIT_ID)
          })
    ],

    devServer: {
        contentBase: "public"
    },

    // Enable sourcemaps for debugging webpack's output.
    devtool: "source-map",

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

    // When importing a module whose path matches one of the following, just
    // assume a corresponding global variable exists and use that instead.
    // This is important because it allows us to avoid bundling all of our
    // dependencies, which allows browsers to cache those libraries between builds.
    // externals: {
    //     "react": "React",
    //     "react-dom": "ReactDOM"
    // }
};