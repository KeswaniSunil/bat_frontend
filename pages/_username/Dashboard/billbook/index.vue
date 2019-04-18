<template>
  <v-layout row wrap>
    <v-flex xs12 text-xs-center>
        <v-card flat>
            <v-card-text class="body-background padding-xs">
                <viewBillbook class="mt-3" />
            </v-card-text>
        </v-card>
    </v-flex>
  </v-layout>
</template>
<script>
import viewBillbook from "@/components/sales/billbook/viewBillbook";
export default {
    layout:"dashboard",
    components:{
        viewBillbook
    },
    data() {
      return {
        
      }
    },
    created(){
        this.getConfiguration()
    },
    methods:{
        getConfiguration(){
            this.$axios.get("/"+this.$route.params.username+"/api/Configurations?access_token="+this.$store.state.token+"&filter[where][alias]=manage_billbook")
            .then(res=>{
                if(res.data.length > 0) {
                    if(res.data[0].value == 0){
                        return this.$nuxt.error({ statusCode: 404, message: "Page Not Found" })
                    }
                }
            })
        }
    }
}
</script>
