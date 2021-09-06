const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = (env, argv) => {
  const isProd = argv.mode === 'production';

  return {
    mode: argv.mode || 'development',
    entry: '/src/index-ol-2.js',
    module: {
      rules: [
        {
          test: /\.m?js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
          },
        },
        {
          test: /\.css$/i,
          use: ['style-loader', 'css-loader'],
        },
        {
          test: /\.png/,
          type: 'asset/resource',
        },
      ],
    },
    target: isProd ? 'browserslist' : 'web',
    plugins: [
      new HtmlWebpackPlugin({
        template: 'src/index.html',
      }),
    ],
  };
};
