const { resolve } = require('path');

module.exports = {
    styles: resolve('src', 'assets', 'styles'),
    'als-components': resolve('src', 'app', 'components'),
    'als-pages': resolve('src', 'app', 'pages'),
    'als-models': resolve('src', 'app', 'models'),
    'als-data-types': resolve('src', 'app', 'dataTypes'),
    'als-ui': resolve('src', 'app', 'ui'),
    'als-routes': resolve('src', 'app', 'routes'),
    'als-hooks': resolve('src', 'app', 'hooks'),
    'als-services': resolve('src', 'services'),
    'als-icons': resolve('src', 'jsxIcons'),
    'als-db-manager': resolve('src', 'dbManager'),
};
