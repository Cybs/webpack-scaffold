var path = require('path')
var fs = require('fs')
var entries = require('./entries.js')

// 页面所在目录
var dirSrc = path.resolve(__dirname, '../src/pages')

var entriesConfig = []

// 排除的目录
var excludeDirs = []
// 遍历目录名
var dirPages = fs.readdirSync(dirSrc).filter(function (dirName) {
  return excludeDirs.indexOf(dirName) === -1 && fs.statSync(dirSrc + '/' + dirName).isDirectory()
})

dirPages.forEach(pageWalk)

// 遍历页面目录文件
function pageWalk (pageName) {
  var filemark = pageName
  var entriesLength = entries.length

  // 替换成配置中的名称（如果存在）
  for (var i = 0; i < entriesLength; i++) {
    if (pageName === entries[i].dir) {
      filemark = entries[i].name
      break
    }
  }

  var pagePath = path.resolve(dirSrc, pageName)
  var files = fs.readdirSync(pagePath)
  var fileHTML = filemark + '.html'
  var fileJS = filemark + '.js'

  if (files.indexOf(fileHTML) === -1 || files.indexOf(fileJS) === -1) return

  var filename = pageName + '/' + fileHTML
  entriesConfig.push({
    entryName: pageName + '/' + filemark,
    entry: path.resolve(dirSrc, pageName, fileJS),
    // 首页特殊处理
    filename: fileHTML,
    template: path.resolve(dirSrc, filename)
  })

  var subDirs = files.filter(function (file) {
    return fs.statSync(pagePath + '/' + file).isDirectory()
  }).map(function (dirName) {
    return pageName + '/' + dirName
  })

  if (subDirs.length) {
    subDirs.forEach(pageWalk)
  }
}

module.exports = {
  entries: entriesConfig,
  assetsRoot: path.resolve(__dirname, '../dist'),
  assetsSubDirectory: 'assets',
  commonsChunkName: ['app', 'vendor', 'manifest'],
  hash: true,
  dev: {
    assetsPublicPath: '/'
  },
  build: {
    // 可配置 CDN
    assetsPublicPath: './'
  },
  useNormallize: true,
  useLibFlexible: true,
  px2Rem: true,
  remUnit: 64,
  useJQuery: true,
  useZepto: true,
  useWeixinJSSDK: false,
  devServerPort: 8080
}
