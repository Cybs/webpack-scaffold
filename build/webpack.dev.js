const path = require('path')
const merge = require('webpack-merge')
const common = require('./webpack.common.js')
const webpack = require('webpack')
// 配置文件
const config = require('../config/config')

const cssLoaders = [
  'style-loader',
  {
    loader: 'css-loader',
    options: {
      minimize: false
    }
  },
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
        use: cssLoaders
      }
    ]
  },
  output: {
    filename: config.assetsSubDirectory + '/js/[name].js',
    path: config.assetsRoot,
    publicPath: config.dev.assetsPublicPath
  },
  plugins: [
    //  指定环境
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('development')
      }
    }),
    // 模块热替换
    new webpack.HotModuleReplacementPlugin(),
    // 提取公共文件
    // https://doc.webpack-china.org/plugins/commons-chunk-plugin/
    new webpack.optimize.CommonsChunkPlugin({
      names: config.commonsChunkName,
      filename: config.assetsSubDirectory + '/js/[name].js',
      minChunks: 3
    })
  ],
  devtool: 'inline-source-map',
  devServer: {
    contentBase: config.assetsRoot,
    port: config.devServerPort,
    overlay: true,
    hot: true,
    // 侦听刷新
    watchContentBase: true
  }
})
