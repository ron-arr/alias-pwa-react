const { resolve } = require('path');

module.exports = {
    styles: resolve('src', 'assets', 'styles'),
    // img: resolve('src', 'assets', 'images'),
    // fonts: resolve('src', 'assets', 'fonts'),
    // store: resolve('src', 'app', 'store'),
    'als-components': resolve('src', 'app', 'components'),
    'als-pages': resolve('src', 'app', 'pages'),
    'als-models': resolve('src', 'app', 'models'),
    'als-ui': resolve('src', 'app', 'ui'),
    'als-routes': resolve('src', 'app', 'routes'),
    'als-services': resolve('src', 'services'),
};
