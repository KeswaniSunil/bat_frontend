import axios from 'axios' 
const crypto = require('crypto')
export const state = () => ({
  isAuth: false,
  token: null,
  userId: 0,
  username: null,
  biggerScreen: true
})

export const mutations = {
  setAuth: function (state, auth) {
    state.isAuth = auth
  },
  setToken: function (state, token) {
    state.token = token
  },
  setUserId: function (state, userId) {
    state.userId = userId
  },
  setUsername: function (state, username) {
    state.username = username
  },
  setBiggerScreen: function (state, biggerScreen) {
    state.biggerScreen = biggerScreen
  }
}

export const actions = {
  // nuxtServerInit is called by Nuxt.js before server-rendering every page
  nuxtServerInit({ commit }, { app }) {
        let isAuth = false,token = null,userId=null,username=null
        
        if (app.$cookies.get('_sessionId') != "") {
          try {
              let mykey = crypto.createDecipher('aes-128-ecb', '123');
              let cookieVal= mykey.update(app.$cookies.get('_sessionId'), 'hex','utf8');
              cookieVal+=mykey.final('utf8');
              const session=JSON.parse(cookieVal)
              if(session.token != "" && session.userId != "" && session.username != "")
              {
                isAuth = true
                token = session.token
                userId = session.userId
                username = session.username
              }
          } catch (err) {
            // No valid cookie found
          }
        }
        commit('setAuth', isAuth)
        commit('setToken', token)
        commit('setUserId', userId)
        commit('setUsername', username)
      }

}
