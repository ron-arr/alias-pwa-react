const { resolve } = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const isProduction = process.env.NODE_ENV === 'production';
const alias = require('./alias');
const scssRule = {
    test: /\.scss$/,
    use: [
        {
            loader: MiniCssExtractPlugin.loader,
            options: {
                hmr: !isProduction,
            },
        },
        {
            loader: 'css-loader',
            options: {
                importLoaders: 2,
                modules: { localIdentName: 'c-als-[local]' },
                localsConvention: 'camelCaseOnly',
            },
        },
        {
            loader: 'postcss-loader',
        },
        {
            loader: 'sass-loader',
        },
    ],
};
console.log(resolve(__dirname, '../'));

module.exports = {
    entry: { app: resolve('src', 'app', 'index.tsx') },
    resolve: {
        alias,
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
    },
    context: resolve(__dirname, '../'),
    target: 'web',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            { ...scssRule, exclude: [resolve('src', 'assets', 'styles')] },
            { ...scssRule, include: [resolve('src', 'assets', 'styles')] },
            { test: /\.txt$/, use: 'raw-loader' },
        ],
    },
    plugins: [new MiniCssExtractPlugin({ filename: 'assets/[name].[hash].css' })],
};
