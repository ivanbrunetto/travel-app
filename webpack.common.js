const path = require('path');
const HtmlWebPackPlugin = require("html-webpack-plugin");

module.exports = {
    entry: './src/client/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        clean: true,
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "babel-loader"
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset/resource',
            },
            {
                test: /\.html$/i,
                loader: "html-loader",
            },
        ]
    },
    plugins: [
        new HtmlWebPackPlugin({
            template: "./src/client/views/index.html",
        }),
    ],
};
