const { resolve, join } = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: 'development',
    output: {
        filename: 'assets/[name].bundle.js',
        chunkFilename: 'assets/[name].[chunkhash:8].chunk.js',
        path: resolve('public'),
        publicPath: '/',
    },
    devServer: {
        hot: true,
        host: 'localhost',
        port: 4201,
        historyApiFallback: true,
    },
    devtool: 'cheap-module-eval-source-map',
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Alias',
            template: resolve('src', 'app', 'index.html'),
            hash: false,
        }),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NamedModulesPlugin(),
    ],
};
