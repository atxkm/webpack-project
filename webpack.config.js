// webpack.config.js
// var glob = require('glob');
const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const CommonsChunkPlugin = require("webpack/lib/optimize/CommonsChunkPlugin");

const cleanDist = new CleanWebpackPlugin(['dist']);

const extractSass = new ExtractTextPlugin({
  filename: "css/[name].css",
  // disable: process.env.NODE_ENV === "development"
});

const copyFile = new CopyWebpackPlugin([{
  from: path.resolve(__dirname, 'app/media'),
  to: path.resolve(__dirname, 'dist/media')
}]);

const commonsChunk = new CommonsChunkPlugin({
  name: 'vendor', // 将公共模块提取，生成名为`vendors`的chunk
  // chunks: ['index','list','about'], //提取哪些模块共有的部分
  // minChunks: 3 // 提取至少3个模块共有的部分
});


let webpackConfig = {
  entry: {},
  output: {
    filename: 'js/[name].js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/'
  },
  // devtool: 'inline-source-map',
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
          loader: "postcss-loader",
          options: {
            config: {
              path: 'postcss.config.js' // 这个得在项目根目录创建此文件
            }
          }
        }, {
          loader: "sass-loader",
          // options: {
          //     sourceMap: true,
          // }
        }],
        fallback: "style-loader"
      })
    }, {
      test: /\.(png|svg|jpg|gif)$/,
      use: [{
        loader: 'url-loader',
        options: {
          limit: '1024',
          name: 'img/[name].[hash:8].[ext]',
          // outputPath: ''
        }
      }]
    }, {
      test: /\.html$/,
      use: [{
        loader: 'html-withimg-loader'
      }]
    }]
  },
  plugins: [
    cleanDist,
    extractSass,
    copyFile,
    commonsChunk
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
  creator: './app/view/creator/creator.ts',
  about: './app/view/about/about.ts',
  download: './app/app/download.ts',
};

Object.keys(entries).forEach(function(name) {

  webpackConfig.entry[name] = entries[name];
  let htmlPath = entries[name].replace('.ts', '.html');

  let plugin = new HtmlWebpackPlugin({
    filename: htmlPath.replace('/app', ''),
    template: path.resolve(__dirname, htmlPath),
    hash: true,
    chunks: ['vendor', name]
  });
  webpackConfig.plugins.push(plugin);
});

module.exports = webpackConfig;