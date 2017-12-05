const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const autoprefixer = require('autoprefixer')
// 配置文件
const config = require('../config/config')
console.log(config)
var entries = {}
// 设置入口文件
config.entries.forEach(function (entry) {
  entries[entry.entryName] = entry.entry
})

// 第三方依赖 js & css
// 必须是所有页面都使用到的第三方库
// 可配合插件 ProvidePlugin 省去依赖声明
// https://doc.webpack-china.org/plugins/commons-chunk-plugin/#-chunk
let vendor = []
if (config.useNormallize) {
  vendor.push('normalize.css')
}
if (config.useJQuery) {
  vendor.push('jquery')
}
if (config.useZepto) {
  vendor.push('webpack-zepto')
}
if (config.useLibFlexible) {
  vendor.push('lib-flexible')
}
vendor.length && (entries.vendor = vendor)

var webpackConfig = {
  //  入口文件
  entry: entries,
  plugins: [
    new HtmlWebpackHarddiskPlugin({
      outputPath: config.assetsRoot
    }),
    // 清理文件
    new CleanWebpackPlugin(['dist'], { root: path.resolve(__dirname, '..'), verbose: true }),
    // CSS前缀
    autoprefixer
  ],
  module: {
    // 打包页面模板
    rules: [{
      test: /\.(html|ejs)(\?.*)?$/,
      use: {
        // https://github.com/emaphp/underscore-template-loader
        loader: 'underscore-template-loader'
      }
    },
      // 打包图片
    {
      test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
      loader: 'url-loader',
      options: {
        limit: 5000,
        name: config.assetsSubDirectory + '/img/[name].[hash:7].[ext]',
        publicPath: process.env.NODE_ENV === 'development'
          ? config.dev.assetsPublicPath
          : config.build.assetsPublicPath
      }
    },
      //  编译es6 eslint
    {
      test: /\.js$/,
      exclude: /(node_modules|bower_components)/,
      use: [{
        loader: 'babel-loader'
      },
      {
        loader: 'eslint-loader',
        options: {
          // community formatter
          formatter: require('eslint-friendly-formatter')
        }
      }
      ]

    },
    // https://github.com/webpack-contrib/url-loader
    {
      test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
      use: [
        {
          loader: 'url-loader',
          options: {
            limit: 10000,
            name: config.assetsSubDirectory + '/fonts/[name].[hash:9].[ext]',
            publicPath: process.env.NODE_ENV === 'development'
              ? config.dev.assetsPublicPath
              : config.build.assetsPublicPath
          }
        }
      ]
    },
    {
      test: /\.mp3(\?.*)?$/,
      loader: 'url-loader',
      options: {
        limit: 10000,
        name: config.assetsSubDirectory + '/media/[name].[hash:7].[ext]',
        publicPath: process.env.NODE_ENV === 'development'
          ? config.dev.assetsPublicPath
          : config.build.assetsPublicPath
      }
    }
    ]
  }
}

config.entries.forEach(function (entry) {
  var options = {
    filename: entry.filename,
    template: entry.template,
    chunks: ['manifest', 'vendor', 'app', entry.entryName],
    inject: true,
    //   解决webpack-dev-server无法刷新的问题
    alwaysWriteToDisk: true
  }

  // 压缩页面
  if (process.env.NODE_ENV === 'production') {
    // options.minify = {
    //   removeAttributeQuotes: true,
    //   collapseWhitespace: true,
    //   html5: true,
    //   minifyCSS: true,
    //   removeComments: true,
    //   removeEmptyAttributes: true
    // }
  }

  // https://github.com/jantimon/html-webpack-plugin
  webpackConfig.plugins.push(new HtmlWebpackPlugin(options))
})

module.exports = webpackConfig
