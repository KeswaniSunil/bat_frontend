const pkg = require('./package')

module.exports = {
  mode: 'universal',

  /*
  ** Headers of the page
  */
  head: {
    title: pkg.name,
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: pkg.description }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons' },
      { rel: 'stylesheet', href: '/style.css' },
      { rel: 'stylesheet', href:'/css/custom.css' }
    ],
    script: [
    ]
  },

  /*
  ** Customize the progress-bar color
  */
  //loading: { color: '#42a5f5' },
  loading: '~/components/loading.vue',
  /*
  ** Global CSS
  */
  css: [
    '~/assets/style/app.styl'
  ],

  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    '@/plugins/vuetify',
    '@/plugins/export'
  ],

  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://github.com/nuxt-community/axios-module#usage
    '@nuxtjs/axios',
    'cookie-universal-nuxt'
  ],
  /*
  ** Axios module configuration
  */
 axios: {
  // See https://github.com/nuxt-community/axios-module#options
  //baseURL: 'http://bcontrol.jdmit.in'
  baseURL: process.env.NODE_ENV == 'development' ? 'http://192.168.0.104:3030' : 'http://bcontrol.jdmit.in'
},
env:{
  //URL: 'http://bcontrol.jdmit.in'
  URL: process.env.NODE_ENV == 'development' ? 'http://192.168.0.104:3030' : 'http://bcontrol.jdmit.in'
}, 

  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extend(config, ctx) {
      
    }
  },
  server:{
    port: 3000,
    host: '0.0.0.0'
  }
}
