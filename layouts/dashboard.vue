<template>
  <v-app>
    <snack-bar />
    <v-navigation-drawer :mini-variant="miniVariant" :clipped="clipped" v-model="drawer" width="250" fixed app dark
      class="primary">
      <loadercontent v-if="loader1" />
      <v-list style="margin-top:50px;background:transparent">
        <v-list-tile style="height:80px;">
          <v-list-tile-content class="height-100">
            <v-list-tile-title class="text-xs-center title font-weight-bold height-100">
              <v-avatar size="100px" @click="$router.push('/'+$route.params.username+'/Dashboard')" style="cursor:pointer;">
                <img src="https://justatic.com/v/20190228102703/shared/images/icons/placeholders/profile.png" alt="Avatar" />
              </v-avatar>
            </v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
      <v-list class="ml-4">
        <v-list-tile v-for="(item, i) in items" :to="item.to" :key="i" router active-class="my-3 info white--text border-radius-left-25"
          class="my-3 transparent white--text border-radius-left-25" :ripple="true">
          <v-list-tile-action style="min-width:40px">
            <v-icon>{{item.icon}}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title v-text="item.title" class="font-weight-light" />
          </v-list-tile-content>
        </v-list-tile>

      </v-list>
    </v-navigation-drawer>
    <v-toolbar v-if="toolbarview" class="elevation-0 theme-color" :clipped-left="clipped" app light>
      <v-toolbar-side-icon  @click="drawer = !drawer">
        <v-icon>list</v-icon>
      </v-toolbar-side-icon>

      <v-toolbar-title>Bussiness Automation Tool</v-toolbar-title>

      <v-spacer></v-spacer>
      <v-menu offset-y bottom left transition="slide-x-transition" light>
        <template v-slot:activator="{ on }">
          <div light flat round v-on="on" class="pa-0 ma-0 text-capitalize" style="cursor:pointer">
            <v-btn flat icon large>
              <v-avatar size="36px">
                <img src="https://cdn2.iconfinder.com/data/icons/rcons-user/32/male-circle-512.png" alt="Avatar" />
              </v-avatar>
            </v-btn>
          </div>
        </template>

        <v-list>
          <v-list-tile :to="'/'+this.$route.params.username+'/Dashboard/CompanyDetails'">
            <v-icon style="padding-right: 10px;">account_circle</v-icon>
            <v-list-tile-title>
              Profile
            </v-list-tile-title>
          </v-list-tile>
          <v-list-tile @click="showModal= true">
            <v-icon style="padding-right: 10px;">settings</v-icon>
            <v-list-tile-title>Company Configs</v-list-tile-title>
          </v-list-tile>
          <v-list-tile @click="modalChngPass= true">
            <v-icon style="padding-right: 10px;">vpn_key</v-icon>
            <v-list-tile-title>Change Password</v-list-tile-title>
          </v-list-tile>
          <v-list-tile @click="logout()">
            <v-icon style="padding-right: 10px;">power_settings_new</v-icon>
            <v-list-tile-title>Log Out</v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-menu>
    </v-toolbar>
    <v-dialog v-model="modalChngPass" width="400">
      <v-card>
        <v-card-title class="pt-2 pb-2" style="border-bottom:1px solid #A5A5A5;">
          <span style="font-size:18px;">Change Password</span>
        </v-card-title>
        <v-card-text class="pa-0">
          <changepassword v-model="modalChngPass" />
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" flat @click="modalChngPass = false">
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog width="300" v-model="showModal">
      <v-card v-if="showModal==true">
        <v-card-title class="pt-2 pb-2" style="border-bottom:1px solid #A5A5A5;">
          <span style="font-size:18px;">All Configs List</span>
        </v-card-title>
        <v-card-text class="pa-2">
          <v-layout align-center justify-start row wrap v-for="(co,index) in allconfig" :key="index">
            <v-flex sm12>
              <v-checkbox class="ma-0 pa-0" :label="co.description" v-model="co.value"></v-checkbox>
            </v-flex>
          </v-layout>
          <v-layout row wrap class="mb-1">
            <v-flex xs8 sm8></v-flex>
            <v-flex xs4 sm4>
              <v-btn color="black" type=button :loading="btnLoading" @click="chngConfig()" style="color:white" class="ma-0 pa-0">
                <v-icon dark small class="mr-1"> edit</v-icon>Change
              </v-btn>
            </v-flex>
          </v-layout>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" flat @click="showModal = false">
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
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
  import loadercontent from "@/components/loadercontent";
  import changepassword from "@/components/auth/changepassword";
  import SnackBar from "@/components/_page/Snackbar";
  export default {
    middleware: 'authenticated',
    components: {
      loadercontent,
      changepassword,
      SnackBar
    },
    created() {
      this.getConfig()
    },
    beforeMount() {
      window.addEventListener('keyup', this.keymonitor)
    },
    mounted() {
      this.$nextTick(() => {
        if (window.innerWidth <= 600) this.$store.commit("setBiggerScreen", false)
        else this.$store.commit("setBiggerScreen", true)
        window.addEventListener('resize', () => {
          if (window.innerWidth <= 600) this.$store.commit("setBiggerScreen", false)
          else this.$store.commit("setBiggerScreen", true)
        })
      })
    },
    data() {
      return {
        loader1: true,
        clipped: false,
        drawer: true,
        toolbarview: true,
        checkbox1: true,
        showModal: false,
        fixed: false,
        btnLoading: false,
        modalChngPass: false,
        items: [],
        miniVariant: false,
        right: true,
        rightDrawer: false,
        title: 'BAT',
        selectConfig: [],
        allconfig: [],
        transport: 0,
        loader2: true
      }
    },
    methods: {
      logout() {
        this.$axios.post("/" + this.$route.params.username + "/api/Users/logout?access_token=" + this.$store.state.token)
          .then(res => {
            this.$cookies.remove("_sessionId");
            window.location = "/" + this.$route.params.username + "/login"
          })
          .catch(e => {
            this.$cookies.remove("_sessionId");
            window.location = "/" + this.$route.params.username + "/login"
          })
      },
      keymonitor(event) {
        //console.log(event);
        if (event.code == 'KeyB' && event.ctrlKey) {
          this.$router.push('/' + this.$route.params.username + '/Dashboard/sales#tab-1')
        }
      },
      chngConfig() {
        this.btnLoading = true;
        //let a=0;
        for (let i = 0; i < this.allconfig.length; i++) {
          this.$axios.post("/" + this.$route.params.username + "/api/Configurations/update?access_token=" + this.$store.state.token + "&where[id]=" + this.allconfig[i].id, {
            value: this.allconfig[i].value
          })
            .then(res => {
              if (res) {
                if (i == this.allconfig.length - 1) {
                  this.$store.commit("snackbar/setSnack", "Configuration Changed!");
                  this.getConfig()
                  this.btnLoading = false
                  this.showModal = false
                  this.$router.push("/" + this.$route.params.username + "/Dashboard")
                }
              }
            });
        }
      },
      async getConfig() {
        await this.$axios.get("/" + this.$route.params.username + "/api/Configurations?access_token=" + this.$store.state.token)
          .then(res => {
            this.items = [
              { icon: 'dashboard', title: 'Dashboard', to: '/' + this.$route.params.username + '/Dashboard/view' },
              { icon: 'store', title: 'Sales', to: '/' + this.$route.params.username + '/Dashboard/sales' },
              { icon: 'shopping_cart', title: 'Purchases', to: '/' + this.$route.params.username + '/Dashboard/purchase' },
              { icon: 'queue', title: 'Items', to: '/' + this.$route.params.username + '/Dashboard/items' },
              { icon: 'storage', title: 'Stock Logs', to: '/' + this.$route.params.username + '/Dashboard/stock' }]
            this.allconfig = res.data;
            let tax = 0
            for (let i = 0; i < this.allconfig.length; i++) {
              if (this.allconfig[i].alias == 'manage_transport') {
                if (this.allconfig[i].value == 1) {
                  this.items.push({ icon: 'subway', title: 'Transport', to: '/' + this.$route.params.username + '/Dashboard/transport' })
                }
              }
              else if (this.allconfig[i].alias == 'calculate_taxes_sales' || this.allconfig[i].alias == 'calculate_taxes_purchase') {
                if (this.allconfig[i].value == 1) {
                  if (tax == 0) {
                    this.items.push({ icon: 'dashboard', title: 'Taxes', to: '/' + this.$route.params.username + '/Dashboard/taxes' })
                    tax = 1
                  }
                }
              }
              else if (this.allconfig[i].alias == 'manage_billbook') {
                if (this.allconfig[i].value == 1) {
                  this.items.push({ icon: 'note_add', title: 'Billbook', to: '/' + this.$route.params.username + '/Dashboard/billbook' })
                }
              }
              else if (this.allconfig[i].alias == 'manage_sms') {
                if (this.allconfig[i].value == 1) {
                  this.items.push({ icon: 'message', title: 'Sms Management', to: '/' + this.$route.params.username + '/Dashboard/sms' })
                }
              }
            }
            this.loader1 = false
          })
          .catch(e => {
            this.logout()
          })
      }
    }
  }
</script>
<style scoped>
.theme-color, .theme-color img {
  background: white !important;
  color: black !important;
}
.theme-color i {
  background: transparent !important;
  color: black !important;
}
@media only screen and (max-width: 1200px) {
  .theme-color{
    background: #1b2237 !important;
    color: white !important;
  }
  .theme-color i {
    background: transparent !important;
    color: white !important;
  }
}
</style>
