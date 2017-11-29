// webpack.config.js
// var glob = require('glob');
const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

const cleanDist = new CleanWebpackPlugin(['dist']);

const extractSass = new ExtractTextPlugin({
  filename: "css/[name].css",
  disable: process.env.NODE_ENV === "development"
});


let webpackConfig = {
  entry: {},
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist')
  },
  devtool: 'inline-source-map',
  devServer: {
    contentBase: './dist',
    host: '0.0.0.0'
  },
  module: {
    rules: [{
      test: /\.scss$/,
      use: extractSass.extract({
        use: [{
          loader: "css-loader"
        }, {
          loader: "sass-loader",
          options: {
            sourceMap: true,
          }
        }],
        fallback: "style-loader"
      })
    }, {
      test: /\.(png|svg|jpg|gif)$/,
      use: [{
        loader: 'url-loader',
        options: {
          limit: '1024',
          name: '[name].[hash:8].[ext]',
          outputPath: '../img/'
        }
      }]
    }, {
      test: /\.html$/,
      use: 'html-withimg-loader'
    }]
  },
  plugins: [
    // cleanDist,
    extractSass,
    new CopyWebpackPlugin([{
      from: path.resolve(__dirname, 'app/media'),
      to: path.resolve(__dirname, 'dist/media')
    }])
  ]
};

// 获取指定路径下的入口文件
// function getEntries(globPath) {
//   var files = glob(path.resolve(__dirname, globPath)),
//     entries = {};

//   console.log(files);

//   files.forEach(function (filepath) {
//     // 取倒数第二层(view下面的文件夹)做包名
//     var split = filepath.split('/');
//     var name = split[split.length - 2];

//     split.pop();
//     entries[name] = './' + split.join('/') + name + '.ts';
//   });

//   return entries;
// }

// var entries = getEntries('app/view/**/*.ts');

// console.log(entries);

let entries = {
  index: './app/index.ts',
  index2: './app/index2.ts'
};

Object.keys(entries).forEach(function(name) {

  webpackConfig.entry[name] = entries[name];

  let plugin = new HtmlWebpackPlugin({
    filename: name + '.html',
    template: path.resolve(__dirname, entries[name].replace('.ts', '.html')),
    // 自动将引用插入html
    hash: true,
    chunks: [name]
  });
  webpackConfig.plugins.push(plugin);
});

module.exports = webpackConfig;