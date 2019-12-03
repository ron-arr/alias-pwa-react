const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const WebpackPwaManifest = require('webpack-pwa-manifest');

const alias = require('./config/alias');

const NODE_ENV = process.env.NODE_ENV;
const isProduction = typeof NODE_ENV !== 'undefined' && NODE_ENV === 'production';
const mode = isProduction ? 'production' : 'development';
console.info('mode:', mode.toUpperCase());
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
            loader: 'postcss-loader',
            options: {
                sourceMap: true,
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
            filename: 'assets/[name].js',
            path: path.join(__dirname, 'public'),
            publicPath: '/',
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
                { ...scssRule, exclude: [path.resolve('src', 'assets', 'styles')] },
                { ...scssRule, include: [path.resolve('src', 'assets', 'styles')] },
                { test: /\.txt$/, use: 'raw-loader' },
            ],
        },
        resolve: {
            alias,
            extensions: ['.js', '.jsx', '.ts', '.tsx'],
        },
        plugins: [
            new CleanWebpackPlugin(),
            new HtmlWebpackPlugin({
                template: path.resolve('src', 'app', 'index.html'),
                favicon: path.resolve('static', 'favicon.ico'),
                hash: true,
            }),
            new MiniCssExtractPlugin({ filename: 'assets/[name].[hash].css' }),
            new WebpackPwaManifest({
                ios: true,
                name: 'Alias (by Ron Arr)',
                lang: 'ru-RU',
                short_name: 'Alias',
                description: 'Играйте в элиас с друзьями!',
                background_color: '#7953d2',
                theme_color: '#4527a0',
                'theme-color': '#4527a0',
                start_url: '/',
                icons: [
                    {
                        src: path.resolve('static/icon.png'),
                        sizes: [96, 128, 192, 256, 384, 512],
                        destination: path.join('assets'),
                    },
                ],
            }),
        ],
    },
];
