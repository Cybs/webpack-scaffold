const path = require('path')
const merge = require('webpack-merge')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const common = require('./webpack.common.js')
const webpack = require('webpack')
// 配置文件
const config = require('../config/config')
const extractCommon = new ExtractTextPlugin({
  filename: config.assetsSubDirectory + '/css/[name].[contenthash:9].css',
  allChunks: true
})
// const extractPages = new ExtractTextPlugin({
//   filename: config.assetsSubDirectory + '/css/[name].[contenthash:9].css',
//   allChunks: true
// })

const cssLoaders = [
  {
    loader: 'css-loader',
    options: {
      minimize: true
    }
  },
  'resolve-url-loader',
  'postcss-loader',
  'sass-loader'
]

if (config.px2Rem) {
  cssLoaders.splice(2, 0, {
    loader: 'px2rem-loader',
    options: {
      remUnit: config.remUnit
    }
  })
}

module.exports = merge(common, {
  module: {
    rules: [
      /* {
        test: /\.(css|scss)(\?.*)?$/,
        // 非公共样式
        exclude: path.resolve(__dirname, '../src/common/css'),
        use: extractPages.extract({
          fallback: 'style-loader',
          use: [{
            loader: 'css-loader',
            options: {
              modules: true, // 模块化
              localIdentName: '[path][name]__[local]--[hash:base64:5]'
            }
          },
          'postcss-loader',
          'sass-loader'
          ]
        })
      }, */
      {
        test: /\.(css|scss)(\?.*)?$/,
        // 公共样式
        // include: path.resolve(__dirname, '../src/common/css'),
        use: extractCommon.extract({
          fallback: 'style-loader',
          use: cssLoaders
        })
      }
    ]
  },
  // https://doc.webpack-china.org/configuration/output/
  output: {
    filename: config.assetsSubDirectory + '/js/[name].[chunkhash:9].js',
    path: config.assetsRoot,
    publicPath: config.build.assetsPublicPath
  },
  plugins: [
    //  指定环境
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    // 避免vendor每次构建都变化
    new webpack.HashedModuleIdsPlugin(),
    // 提取公共文件
    // https://doc.webpack-china.org/plugins/commons-chunk-plugin/
    new webpack.optimize.CommonsChunkPlugin({
      names: config.commonsChunkName,
      filename: config.assetsSubDirectory + '/js/[name].[chunkhash:9].js',
      minChunks: 3
    }),
    // https://doc.webpack-china.org/plugins/extract-text-webpack-plugin/
    // extractPages,
    extractCommon,
    new UglifyJSPlugin()
  ]
})
