const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    app: './src/app/app.js',
    vendor: ['angular', 'jquery', 'bootstrap']
  },
  output: {
    path: __dirname + '/dist',
    filename:'[name].js'
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      inject: 'body'
    }),
    // new webpack.ProvidePlugin({
    // $: 'jquery',
    // jQuery: 'jquery',
    // 'window.jQuery': 'jquery',
    // angular: 'angular',
    // })
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      { test: /\.html$/, loader: 'html-loader' },
      {
        test: /\.(png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)$/,
        loader: 'file-loader'
      }
    ]
  },
  optimization: {
    // We no not want to minimize our code.
    minimize: false,

    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendor",
          chunks: "initial",
        },
      },
    },
  },
};
