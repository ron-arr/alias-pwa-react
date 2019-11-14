const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const alias = require('./config/alias');

const isProduction = typeof NODE_ENV !== 'undefined' && NODE_ENV === 'production';
const mode = isProduction ? 'production' : 'development';
const devtool = isProduction ? false : 'inline-source-map';
const scssRule = {
    test: /\.scss$/,
    use: [
        {
            loader: MiniCssExtractPlugin.loader,
            options: {
                hmr: mode === 'development',
            },
        },
        {
            loader: 'css-loader',
            options: {
                sourceMap: mode == 'development',
                importLoaders: 2,
                modules: { localIdentName: 'c-als-[local]' },
                localsConvention: 'camelCaseOnly',
            },
        },
        {
            loader: 'sass-loader',
            options: {
                sassOptions: {
                    includePaths: [path.resolve(__dirname, './node_modules/compass-mixins/lib')],
                },
            },
        },
    ],
};

module.exports = [
    {
        entry: { app: './src/app/index.tsx' },
        output: {
            filename: '[name].js',
            path: path.join(__dirname, 'dist', 'public'),
        },
        target: 'web',
        devServer: {
            hot: true,
            host: 'localhost',
            port: 4201,
            historyApiFallback: true,
        },
        mode,
        devtool,
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    use: 'ts-loader',
                    exclude: /node_modules/,
                },
                // { ...scssRule },
                { ...scssRule, exclude: [path.resolve('src', 'assets', 'styles')] },
                { ...scssRule, include: [path.resolve('src', 'assets', 'styles')] },
            ],
        },
        resolve: {
            alias,
            extensions: ['.js', '.jsx', '.ts', '.tsx'],
        },
        plugins: [
            new CleanWebpackPlugin(),
            new HtmlWebpackPlugin({ template: path.resolve('src', 'app', 'index.html') }),
            new MiniCssExtractPlugin({ filename: '[name].[hash].css' }),
        ],
    },
];
