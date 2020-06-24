const resolve = (dir) => require('path').resolve(__dirname, dir);
module.exports = {
  publicPath: '.',
  configureWebpack: {
    resolve: {
      alias: {
        '@': resolve('src'),
      },
    },
  },
  devServer: {
    disableHostCheck: true,
    proxy: {
      '/api': {
        target: process.env.VUE_APP_PROXY_HOST,
        changeOrigin: true,
        secure: false,
        pathRewrite: {
          '/api': '',
        },
      },
    },
  },
  transpileDependencies: ['vuetify'],
};
