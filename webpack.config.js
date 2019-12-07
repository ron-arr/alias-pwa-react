const webpackMerge = require('webpack-merge');
const base = require('./config/webpack.config.base');

const envs = {
    development: 'dev',
    production: 'prod',
};
/* eslint-disable global-require,import/no-dynamic-require */
const env = envs[process.env.NODE_ENV || 'development'];
const envConfig = require(`./config/webpack.config.${env}`);
const config = webpackMerge(base, envConfig);

module.exports = config;
