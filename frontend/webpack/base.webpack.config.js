const path = require("path");
const dotenv = require('dotenv');
const fs = require('fs');
const webpack = require("webpack");
const HtmlWebpackChangeAssetsExtensionPlugin = require('html-webpack-change-assets-extension-plugin');
const { styles } = require( '@ckeditor/ckeditor5-dev-utils' );
const CKEditorWebpackPlugin = require( '@ckeditor/ckeditor5-dev-webpack-plugin' );

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
    console.log(ENV_KEYS);
    return {
        entry: "./src/index.tsx",
        output: {
            filename: "bundle.js",
            chunkFilename: '[name].bundle.js',
            path: path.resolve(__dirname + "/../public/dist"),
            publicPath: "/dist/"
        },
        resolve: {
            extensions: [".ts", ".tsx", ".js", ".json"]
        },
        plugins: [
            new webpack.DefinePlugin(ENV_KEYS),
            new CKEditorWebpackPlugin({language: 'en'})
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
                    use:['style-loader','css-loader'],
                    exclude: [
                        /ckeditor5-[^/\\]+[/\\]theme[/\\].+\.css/,
                      ],
                },
                {
                    test: /ckeditor5-[^/]+\/theme\/[\w-/]+\.css$/,
                    use: [
                        {
                            loader: 'style-loader',
                            options: {
                                singleton: true
                            }
                        },
                        {
                            loader: 'postcss-loader',
                            options: styles.getPostCssConfig( {
                                themeImporter: {
                                    themePath: require.resolve( '@ckeditor/ckeditor5-theme-lark' )
                                },
                                minify: true
                            } )
                        },
                    ]
                },
                {
                    test: /\.svg$/,
                    loader: 'svg-react-loader',
                    exclude: [/ckeditor5-[^/\\]+[/\\]theme[/\\]icons[/\\][^/\\]+\.svg$/,]
                },
                {
                    test: /\.(jpe?g|gif|png|svg|woff|ttf|wav|mp3)$/,
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]',
                        outputPath: 'static/images/'
                    },
                    exclude: [/ckeditor5-[^/\\]+[/\\]theme[/\\]icons[/\\][^/\\]+\.svg$/,]
                },
                {
                    test: /ckeditor5-[^/\\]+[/\\]theme[/\\]icons[/\\][^/\\]+\.svg$/,
                    loader: 'raw-loader'
                },
            ]
        }
    }
};
