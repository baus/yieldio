const path = require('path');
const webpack = require('webpack');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
    devtool: 'source-map',
    entry: {
        react: './client/index-react.js'
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'server/static/scripts'),
        publicPath: '/scripts'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ["es2015", "react"]
                    }
                }
            },
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: "css-loader"
                })
            }, {
                test: /\.scss$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        {
                            loader: 'css-loader',
                            options: {
                                sourceMap: true,
                                minimize: true,
                                discardComments: {
                                    removeAll: true
                                }
                            }
                        },
                        {
                            loader: 'postcss-loader',
                            options: {
                                plugins: () => [require('autoprefixer')],
                                sourceMap: true
                            }
                        },
                        {
                            loader: 'sass-loader',
                            options: {
                                sourceMap: true
                            }
                        }
                    ]
                })
            }]
    },
    devServer: {
        contentBase: path.join(__dirname, "dist"),
        compress: true,
        port: 8080
    },
    plugins: [
        new ExtractTextPlugin("styles.css"),
        new webpack.LoaderOptionsPlugin({
            minimize: true,
            debug: false
        }),
        new UglifyJSPlugin({
            sourceMap: true,
            uglifyOptions: {
                beautify: false,
                ecma: 6,
                compress: true,
                comments: false
            }
        })
    ]
};
