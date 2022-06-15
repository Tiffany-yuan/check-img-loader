const path = require('path');
const webpack = require('webpack');
const memoryfs = require('memory-fs');

module.exports = {
    mode: 'production',
    context: __dirname,
    entry: `./example.html`,
    output: {
        path: path.resolve(__dirname),
        filename: 'bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.html$/,
                loader: path.resolve(__dirname, '../index.js'),
                options: {
                    whiteList: ['kdzs-xcx-front.oss-cn-zhangjiakou.aliyuncs.com', 'img.alicdn.com']
                }
            }
        ]
    }
};