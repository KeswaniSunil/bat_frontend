<template>
  <v-app>
    <v-navigation-drawer :mini-variant="miniVariant" :clipped="clipped" v-model="drawer" width="250" fixed app dark
      class="side-menu">
      <v-list class="mx-3" style="background:transparent">
        <v-list-tile>
          <v-list-tile-content>
            <v-list-tile-title class="text-xs-center title font-weight-bold">{{title}}</v-list-tile-title>
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
    <v-toolbar color="white" v-if="toolbarview" class="elevation-0" :clipped-left="clipped" app light>
      <v-toolbar-side-icon @click="drawer = !drawer"></v-toolbar-side-icon>

      <v-toolbar-title>Page title</v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn icon>
        <v-icon>search</v-icon>
      </v-btn>

      <v-menu offset-y>
            <template v-slot:activator="{ on }">
              <v-btn
                light
                icon
                v-on="on"
              >
                <v-icon>more_vert</v-icon>
              </v-btn>
            </template>

            <v-list>
              <v-list-tile  >
                <v-list-tile-title><router-link style="text-decoration:none;" :to="'/'+this.$route.params.username+'/dashboard/CompanyDetails'" class="dropdown-item">View/Edit Profile</router-link></v-list-tile-title>
              </v-list-tile>
              <v-list-tile >
                <v-list-tile-title>Company Configs</v-list-tile-title>
              </v-list-tile>
              <v-list-tile >
                <v-list-tile-title style="cursor:pointer" @click="logout()">Log Out</v-list-tile-title>
              </v-list-tile>
            </v-list>
          </v-menu>
    </v-toolbar>
    <v-content class="padding-print-0 body-background">
      <v-container class="pa-0" style="max-width:100%">
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
    middleware : 'authenticated',
    data() {
      return {
        clipped: false,
        drawer: true,
        toolbarview: true,
        fixed: false,
        items: [
          { icon: 'bubble_chart', title: 'Sales', to: '/jay/Dashboard/sales' },
          { icon: 'bubble_chart', title: 'Purchases', to: '/jay/Dashboard/purchase' },
          { icon: 'bubble_chart', title: 'Items', to: '/jay/Dashboard/items' },
          { icon: 'bubble_chart', title: 'Stock', to: '/jay/Dashboard/items/stock' }
        ],
        miniVariant: false,
        right: true,
        rightDrawer: false,
        title: 'BAT'
      }
    },
    methods:{
      logout()
    	{
			  this.$axios.post("/"+this.$route.params.username+"/api/Users/logout?access_token="+this.$store.state.token)
			  .then(res => {
		  		this.$cookies.remove("_sessionId");
           		window.location="/"+this.$route.params.username+"/login"
			   })
			   .catch(e=>{
				   this.$cookies.remove("_sessionId");
           			window.location="/"+this.$route.params.username+"/login"
			   })
    	}
    }
  }
</script>
<style>
  .border-radius-5 {
    border-radius: 5px;
  }
</style>