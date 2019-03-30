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

      <v-toolbar-title>Dashboard</v-toolbar-title>

      <v-spacer></v-spacer>
      <v-menu offset-y>
            <template v-slot:activator="{ on }">
              <v-btn
                type=button
                light
                flat
                round
                v-on="on"
                class="pa-0 ma-0"
              >
                <span class="title">{{$store.state.username}}</span><v-icon>expand_more</v-icon>
              </v-btn>
            </template>

            <v-list>
              <v-list-tile  >
                <v-list-tile-title><router-link style="text-decoration:none;" :to="'/'+this.$route.params.username+'/dashboard/CompanyDetails'" class="dropdown-item">View/Edit Profile</router-link></v-list-tile-title>
              </v-list-tile>
              <v-list-tile >
                <v-list-tile-title style="cursor:pointer" @click="showModal= true,getConfig()">Company Configs</v-list-tile-title>
              </v-list-tile>
              <v-list-tile >
                <v-list-tile-title style="cursor:pointer" @click="logout()">Log Out</v-list-tile-title>
              </v-list-tile>
            </v-list>
          </v-menu>
    </v-toolbar>
    <v-dialog width="300" v-model="showModal" >
                        <v-card v-if="showModal==true" >
                            <v-card-title class="pt-2 pb-2" style="border-bottom:1px solid #A5A5A5;">
                            <span style="font-size:18px;">All Configs List</span>
                            </v-card-title>
                            <v-card-text class="pa-2">
                              <v-layout align-center justify-start row wrap v-for="(co,index) in allconfig" :key="index" >
                              
                                    <v-flex sm12>
                                      <v-checkbox class="ma-0 pa-0" :label="co.description" v-model="co.value"></v-checkbox>
                                    </v-flex>
                                  
                                
                              </v-layout>
                              <v-layout row wrap class="mb-1">
                                <v-flex xs8 sm8></v-flex>
                                <v-flex xs4 sm4>
                                  <v-btn color="black" type=button :loading="btnLoading" @click="chngConfig()" style="color:white" class="ma-0 pa-0" >
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
  export default {
    middleware : 'authenticated',
    created(){
      this.getConfig()
    },
    data() {
      return {
        clipped: false,
        drawer: true,
        toolbarview: true,
        checkbox1:true,
        showModal:false,
        fixed: false,
        btnLoading:false,
        items: [
          { icon: 'bubble_chart', title: 'Sales', to: '/'+this.$route.params.username+'/Dashboard/sales' },
          { icon: 'bubble_chart', title: 'Purchases', to: '/'+this.$route.params.username+'/Dashboard/purchase' },
          { icon: 'bubble_chart', title: 'Items', to: '/'+this.$route.params.username+'/Dashboard/items' },
          { icon: 'bubble_chart', title: 'Stock', to: '/'+this.$route.params.username+'/Dashboard/items/stock' },
          { icon: 'bubble_chart', title: 'Transport', to: '/'+this.$route.params.username+'/Dashboard/transport' },
          { icon: 'bubble_chart', title: 'Taxes', to: '/'+this.$route.params.username+'/Dashboard/taxes' },
        ],
        miniVariant: false,
        right: true,
        rightDrawer: false,
        title: 'BAT',
        selectConfig:[],
			  allconfig:[],
        transport:0
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
    	},
      chngConfig(){
        this.btnLoading=true;
        //let a=0;
				for(let i=0;i<this.allconfig.length;i++){
					this.$axios.post("/"+this.$route.params.username+"/api/Configurations/update?access_token="+this.$store.state.token+"&where[id]="+this.allconfig[i].id,{
						value:this.allconfig[i].value
					})
					.then(res=>{
            if(res){
              if(i == this.allconfig.length - 1)
              {
                window.location=""
          
              }
            }
					});				
				}	
		},
		async getConfig(){
			await this.$axios.get("/"+this.$route.params.username+"/api/Configurations?access_token="+this.$store.state.token)
				.then(res=>{
          this.allconfig=res.data;
          let a=0,b=0,c=0;
          let promise1 = new Promise((resolve,reject)=>{
            for(let i=0;i<this.allconfig.length;i++)
            {
              if(this.allconfig[i].alias == 'manage_transport')
              {
                if(this.allconfig[i].value == 0) {
                    this.items.splice(4,1)
                    c=1;
                }
              }
              else if(this.allconfig[i].alias == 'calculate_taxes_sales')
              {
                if(this.allconfig[i].value == 0) a=1;
              }
              else if(this.allconfig[i].alias == 'calculate_taxes_purchase')
              {
                if(this.allconfig[i].value == 0) b=1;
              }
            }
            resolve();
          });
          promise1.then((resolve)=>{
            if(c==1){
              if(a==1 && b==1){
                this.items.splice(4,1)
              }
            }
            else{
              if(a==1 && b==1){
                this.items.splice(5,1)
              }
            }
          });
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