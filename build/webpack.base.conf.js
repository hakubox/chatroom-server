/* 引入操作路径模块和webpack */
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

const pkg = require("../package.json");
//读取package.json中的theme字段,如果是string类型，读取配置文件。如果是object类型，则作为参数传给modifyVar

module.exports = {
    resolve: {
        extensions: ['.js', '.vue'],
        alias: {
            'vue$': 'vue/dist/vue.esm.js',
            '@': path.resolve('src')
        }
    },
    mode: 'development',
    /* 输入文件 */
    entry: {
        index: [path.resolve(__dirname, '../src/main.js')]
    },
    output: {
        /* 输出目录，没有则新建 */
        path: path.resolve(__dirname, '../dist'),
        /* 静态目录，可以直接从这里取文件 */
        publicPath: '/',
        /* 文件名 */
        filename: 'js/[name].[hash].js',
        chunkFilename: 'js/[name].[chunkhash].js'
    },
    module: {
        rules: [{
            test: /\.vue$/,
            loader: 'vue-loader',
            options: {
                loaders: {
                    css: ExtractTextPlugin.extract({
                        use: 'style-loader!css-loader',
                        fallback: 'vue-style-loader' // <- this is a dep of vue-loader, so no need to explicitly install if using npm3
                    }),
                    less: ExtractTextPlugin.extract({
                        use: 'style-loader!css-loader!less-loader',
                        fallback: 'vue-style-loader' // <- this is a dep of vue-loader, so no need to explicitly install if using npm3
                    }),
                }
            }
        }, {
            test: /\.css/,
            loader: ['style-loader','css-loader']
        }, {
            test: /\.less/,
            use:['style-loader','css-loader','less-loader']
        }, {
            test: /\.js$/,
            /* 排除模块安装目录的文件 */
            exclude: /node_modules/
        },{
            test: /\.png$|\.jpg$|\.gif$|\.ico$/,
            use: [
                {
                    loader: 'file-loader',
                    options: {
                        name: '[name].[hash:8].[ext]',
                        publicPath: '/images',
                        outputPath: './images',
                    }
                }
            ]
        },{
            test: /\.(eot|ttf|woff|woff2)$/,
            loader: "file-loader",
            options: {
                name: '[name].[hash:8].[ext]',
                publicPath: '/fonts',
                outputPath: './fonts',
            }
        }]
    },
    plugins: [
        new VueLoaderPlugin(),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: path.resolve(__dirname, '../public/index.html'),
            inject: true,
            minify: {
                minifyJS: true
            },
            hash: true
        }),
        new ExtractTextPlugin("style.css")
    ]
}