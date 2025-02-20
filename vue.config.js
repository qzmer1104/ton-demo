const { defineConfig } = require('@vue/cli-service')
const webpack = require('webpack')
const path  = require('path')
const isPord= process.env.NODE_ENV ==='production';
process.env.VUE_APP_Version = 'v20200516'
console.log(process.env,'env')
module.exports = defineConfig({
  assetsDir: 'public',
  publicPath: './',
  outputDir: 'dist',
  chainWebpack: (config) => {
    config.plugins.delete('prefetch')
        config.plugins.delete('preload')
    config.mode= isPord ? 'production':'development';
    // svg-sprite-loader
    config.module
    .rule('svg')
    .exclude.add(path.join(__dirname, 'src/assets/icons/svg'))
    .end()

  config.module
    .rule('icons')
    .test(/\.svg$/)
    .include.add(path.join(__dirname, 'src/assets/icons/svg'))
    .end()
    .use('svg-sprite')
    .loader('svg-sprite-loader')
    .options({
      symbolId: 'icon-[name]',
      svgo: {
        plugins: [
          {
            removeViewBox: false
          }
        ]
      }
    })
    .end();
    if(isPord){
      config.plugin("CompressionPlugin").use('compression-webpack-plugin', [{
          filename: '[path][base].gz',
          algorithm: 'gzip',
          // 要压缩的文件（正则）
          test: /\.(js|html|png|svg)(\?.*)?$/i,
          // 最小文件开启压缩
          threshold: 10240,
          minRatio: 0.8,
          deleteOriginalAssets:false,
        }])
      config.optimization.minimizer('terser').tap((args) => {
        // 注释console.*
        // args[0].terserOptions.compress.drop_console = true
        // remove debugger
        args[0].terserOptions.compress.drop_debugger = true
        // 移除 console.log
        // args[0].terserOptions.compress.pure_funcs = ['console.log']
        // 去掉注释 如果需要看chunk-vendors公共部分插件，可以注释掉就可以看到注释了
        args[0].terserOptions.output = {
          comments: false
        };
        return args
      })
    }
  },
  productionSourceMap: false,
  transpileDependencies: true,
  devServer: {
    port: 4000,
    client: {
      overlay: false
    },
    proxy: {
      '/api': {
        target: process.env.VUE_APP_BASE_API, // target表示代理的服务器url
        // target: 'http://cc.doc.crosscoin.top', // target表示代理的服务器url
        changeOrigin: true,
        pathRewrite: {     // pathRewrite表示路径重写，key表示一个正则，value表示别名
          '^/api': '/api'   // 即用 '/api'表示'http://localhost:3000/api'
        }
      },
      '/u': {
        disableHostCheck: true,
        target: process.env.VUE_APP_USER_API, // target表示代理的服务器url
        changeOrigin: true,
      },
    },
    historyApiFallback:{
      index:'/index.html'
    }
  },
  configureWebpack:{
    resolve:{
      alias: {
        '@': path.resolve('src'),
      }
    },
    plugins: [
      // Work around for Buffer is undefined:
      // https://github.com/webpack/changelog-v5/issues/10
      new webpack.ProvidePlugin({
        Buffer: ['buffer', 'Buffer'],
      }),
    ],
  },
  lintOnSave: true,
})
