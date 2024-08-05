const { merge } = require('webpack-merge');
const common = require('./webpack.common');
const WorkboxPlugin = require('workbox-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin')

module.exports = merge(common, {
    mode: 'production',
    optimization: {
        minimizer: [
            new CssMinimizerPlugin(),
            new TerserPlugin(),
        ],
    },
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: [ MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
            }
        ]
    },
    plugins: [
        new WorkboxPlugin.GenerateSW(),
        new MiniCssExtractPlugin({ filename: '[name].css' }),
    ],
});
