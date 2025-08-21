const { defineConfig } = require('@vue/cli-service')
const webpack = require('webpack');

module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    port: 3000,
  },
  configureWebpack: {
    plugins: [
      new webpack.DefinePlugin({
        // deafault value is false, but it seems webpack needs extra configuration
        // 이 옵션을 true로 하면 번들 안의 코드가 늘어나 랜더링 성능이 떨어짐
        __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'false',
      })
    ],
  },
})