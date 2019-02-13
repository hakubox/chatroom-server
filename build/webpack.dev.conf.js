const merge = require('webpack-merge');
const baseConfig = require('./webpack.base.conf');
const webpack = require('webpack');

let devConfig =  merge(baseConfig, {
    resolve: {
        extensions: ['.js', '.vue'],
        alias: {
            vue: 'vue/dist/vue.esm.js'
        }
    },
    output: {
        path: '/'
    },
    plugins: [
        new webpack.NoEmitOnErrorsPlugin()
    ]
});

module.exports = devConfig;