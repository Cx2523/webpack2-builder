const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path'); //for Webpack 2, using node's path library to create absolute path in output.path config
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');
const webpack = require('webpack');
const bootstrapEntryPoints = require('./webpack.bootstrap.config.js');
//Node doesn't support ES6 import/export yet so
//commonJS is used.

//NODE_ENV is set whenever the prod script is run. If the prod script is not run it is undefined.
const isProdEnv = process.env.NODE_ENV === "production";
const cssDev = ['style-loader', 'css-loader', 'sass-loader'];
const cssProd = ExtractTextWebpackPlugin.extract({
    fallback: 'style-loader',
    use: ['css-loader', 'sass-loader'],
    publicPath: '/dist'
});
const cssConfig = isProdEnv ? cssProd : cssDev;
const bootstrapConfig = isProdEnv ? bootstrapEntryPoints.prod : bootstrapEntryPoints.dev;


module.exports = {
  entry: {
    index: './src/index.js',
    bootstrap: bootstrapConfig
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: '[name].bundle.js'
  },
  devServer:{
      contentBase: path.join(__dirname, "dist"),
      compress: true,
      port: 8000,
      open: true,
      stats: "errors-only",
      hot: true,
      historyApiFallback: true
  },
  plugins: [
    new HtmlWebpackPlugin(
      {
        title: 'Custom Template',
        // minify: {
        //   collapseWhitespace: true
        // },
        hash: true,
        template: './src/template.html',
        filename: 'index.html'
      }
    ),
    new ExtractTextWebpackPlugin({
      filename: '/css/[name].css',
      disable: !isProdEnv,
      allChunks: true
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin()
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader'
      },
      {
        test: /\.scss$/,
        use: cssConfig
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        use: 'file-loader?name=[name].[ext]&outputPath=images/'
      },
      { test: /\.(woff2?|svg)$/, loader: 'url-loader?limit=10000&name=fonts/[name].[ext]' },
      { test: /\.(ttf|eot)$/, loader: 'file-loader?name=fonts/[name].[ext]' },
      { test: /bootstrap-sass[\/\\]assets[\/\\]javascripts[\/\\]/, loader: 'imports-loader?jQuery=jquery' }
    ]
  }
};
