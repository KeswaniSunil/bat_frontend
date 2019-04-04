import Vue from 'vue'
import Vuetify from 'vuetify'
import colors from 'vuetify/es5/util/colors'

Vue.use(Vuetify, {
  theme: {
    primary: '#1b2237', // a color that is not in the material colors palette
    accent: colors.grey.darken3,
    secondary: colors.amber.darken3,
    info: colors.indigo,
    warning: colors.amber.base,
    error: colors.deepOrange.accent4,
    success: colors.green.accent3
  }
})
