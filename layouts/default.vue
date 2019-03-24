<template>
  <v-app>
    <v-navigation-drawer :mini-variant="miniVariant" :clipped="clipped" v-model="drawer" width="250" fixed app dark
      class="side-menu">
      <v-list class="mx-3" style="background:transparent">
        <v-list-tile>
          <v-list-tile-content>
            <v-list-tile-title class="text-xs-center title font-weight-bold">Vuejs</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-divider width="220" class="white"></v-divider>

        <v-list-tile v-for="(item, i) in items" :to="item.to" :key="i" router exact active-class="my-3 blue lighten-1 white--text border-radius-5"
          class=" my-3 transparent white--text border-radius-5" :ripple="true">
          <v-list-tile-action style="min-width:40px">
            <v-icon>dashboard</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title v-text="item.title" class="font-weight-light" />
          </v-list-tile-content>
        </v-list-tile>

      </v-list>
    </v-navigation-drawer>
    <v-toolbar color="grey lighten-4" v-if="toolbarview" :clipped-left="clipped" app light>
      <v-toolbar-side-icon @click="drawer = !drawer"></v-toolbar-side-icon>

      <v-toolbar-title>Page title</v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn icon>
        <v-icon>search</v-icon>
      </v-btn>

      <v-btn icon>
        <v-icon>more_vert</v-icon>
      </v-btn>
    </v-toolbar>
    <v-content class="grey lighten-3">
      <v-container class="pa-0">
        <nuxt />
      </v-container>
    </v-content>
    <!--<v-footer
      :fixed="fixed"
      app
    >
      <span>&copy; 2017</span>
    </v-footer>-->
  </v-app>
</template>

<script>
  export default {
    middleware: [
      //'authenticated'
    ],
    data() {
      return {
        clipped: false,
        drawer: true,
        toolbarview: true,
        fixed: false,
        items: [
          { icon: 'apps', title: 'Main', to: '/home' },
          { icon: 'apps', title: 'Welcome', to: '/' },
          { icon: 'bubble_chart', title: 'Sales', to: '/jay/Dashboard/sales' }
        ],
        miniVariant: false,
        right: true,
        rightDrawer: false,
        title: 'Vuetify.js'
      }
    }
  }
</script>
<style>
  .border-radius-5 {
    border-radius: 5px;
  }
</style>