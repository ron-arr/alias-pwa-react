const { resolve } = require('path');

module.exports = {
    styles: resolve('src', 'assets', 'styles'),
    img: resolve('src', 'assets', 'images'),
    fonts: resolve('src', 'assets', 'fonts'),
    store: resolve('src', 'app', 'store'),
    components: resolve('src', 'app', 'components'),
    models: resolve('src', 'app', 'models'),
    ui: resolve('src', 'app', 'ui'),
    services: resolve('src', 'services'),
};
