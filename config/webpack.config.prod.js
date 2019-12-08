const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const WebpackPwaManifest = require('webpack-pwa-manifest');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');

const { join, resolve } = require('path');

module.exports = {
    mode: 'production',
    output: {
        filename: 'assets/[name].bundle.js',
        chunkFilename: 'assets/[name].[chunkhash:8].chunk.js',
        path: resolve('public'),
        publicPath: '/',
    },
    devtool: 'source-map',
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            title: 'Alias',
            template: resolve('src', 'app', 'index.html'),
            favicon: resolve('static', 'favicon.ico'),
            hash: true,
        }),
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
            display: 'standalone',
            icons: [
                {
                    src: resolve('static/icon.png'),
                    sizes: [96, 128, 192, 256, 384, 512],
                    destination: join('assets'),
                },
                {
                    src: resolve('static/icon.png'),
                    sizes: [120, 152, 167, 180, 1024],
                    destination: join('assets'),
                    ios: true,
                },
            ],
        }),
        new WorkboxPlugin.GenerateSW({
            // these options encourage the ServiceWorkers to get in there fast
            // and not allow any straggling "old" SWs to hang around
            clientsClaim: true,
            skipWaiting: true,
        }),
    ],
};
