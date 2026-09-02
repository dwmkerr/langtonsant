const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    app: './src/app/app.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    clean: true
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      inject: 'body'
    }),
    //  Bootstrap 3's dist bundle reads jQuery as a global rather than importing
    //  it, so it has to be provided as a free variable.
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery'
    })
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      { test: /\.html$/, loader: 'html-loader' },
      {
        test: /\.(png|jpe?g|gif|svg|woff2?|ttf|eot)$/,
        type: 'asset/resource'
      }
    ]
  },
  optimization: {
    //  The bundle is meant to be readable: this is a demonstration of a
    //  cellular automaton, and people do read the shipped source.
    minimize: false,

    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendor',
          chunks: 'initial'
        }
      }
    }
  }
};
