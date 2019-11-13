//These imports are not currently working
//Look at solutions
const path = require('path');
const miniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    entry: './src/index.ts',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-typescript'],
                    }
                },
                exclude: '/node_modules/',
            },
            {
                test: /\.jsx?$/,
                use: {
                    loader: 'source-map-loader',
                },
                enforce: 'pre',
                exclude: '/node_modules/',
            },
            {
                test: /\.(sc|sa|c)ss$/,
                use: [
                    {
                        loader: miniCssExtractPlugin.loader,
                    },
                    {
                        loader: 'css-loader',
                    },
                    {
                        loader: 'postcss-loader',
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            implementation: require("sass"),
                        },
                    },
                ],
            },
            {
                test: /\.(png|jpe?g|svg|gif)$/,
                use: {
                    loader: 'file-loader',
                    options: {
                        outputPath: 'images',
                    },
                },
            },
        ],
    },
    plugins: [
        new miniCssExtractPlugin({
            filename: "bundle.css",
        }),
    ],
    resolve: {
        extensions: [ '.ts', '.tsx', '.js'],
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.min.js',
    },
    mode: 'development',
};