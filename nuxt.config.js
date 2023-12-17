module.exports = {
  /*
  ** Headers of the page
  */
  head: {
    title: '企小保保险购买统一平台',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '尚医通项目平台' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  module: [
    // '@nuxtjs/composition-api/module',
    // "@pinia/nuxt"
    '@nuxtjs/proxy'
  ],
  // proxy: {
  //   '^/BusinessServer': {
  //     changeOrigin: true,
  //     target: 'http://192.168.50.26:8088', // 允许跨域的服务器地址
  //     pathRewrite: {
  //       '^/BusinessServer': '/BusinessServer'
  //     }
  //   }
  // },

  /*
  ** Customize the progress bar color
  */
  loading: { color: '#3B8070' },
  /*
  ** Build configuration
  */
  build: {
    // extractCSS: process.env.NODE_ENV === 'production',
    /*
    ** Run ESLint on save
    */

    extend(config, { isDev, isClient }) {
      if (isDev && isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    }
  },
  plugins: [
    { src: '~/plugins/myPlugin.js', ssr: false },
    { src: '~/plugins/localStorage.js', ssr: false },

  ]

}

