<template>
  <v-app>
    <v-navigation-drawer
      :mini-variant="miniVariant"
      :clipped="clipped"
      v-model="drawer"
      width="250"
      fixed
      app
      dark
      class="red"
    >
      <v-list class="mx-3" style="background:transparent">
      <v-list-tile>
          <v-list-tile-content>
            <v-list-tile-title class="text-xs-center title font-weight-bold">Vuejs</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
          <v-divider width="220"></v-divider>
        
        <v-list-tile
          v-for="(item, i) in items"
          :to="item.to"
          :key="i"
          router
          exact
          active-class="my-3 grey lighten-3 black--text border-radius-40"
          class=" my-3 transparent white--text border-radius-40"
          :ripple="true"
        >
          <v-list-tile-action>
            <v-icon>dashboard</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title  v-text="item.title" />
          </v-list-tile-content>
        </v-list-tile>
        
      </v-list>
    </v-navigation-drawer>
    <v-toolbar
      color="red"
      v-if="toolbarview"
      :clipped-left="clipped"
      app
      dark
    >
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
      <v-container class="pa-0" >
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
    data() {
      return {
        clipped: false,
        drawer: true,
        toolbarview:false,
        fixed: false,
        items: [
          { icon: 'apps', title: 'Main', to: '/home' },
          { icon: 'apps', title: 'Welcome', to: '/' },
          { icon: 'bubble_chart', title: 'Inspire', to: '/inspire' }
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
.border-radius-40{
    border-radius:40px;
}
</style>