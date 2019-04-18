<template>
    <v-card flat>
        <v-card-text class="body-background padding-xs">
            <viewTransport class="mt-3"/>
        </v-card-text>
    </v-card>
</template>
<script>
import viewTransport from "~/components/transport/viewTransport";
export default {
    layout:'dashboard',
    components:{
        viewTransport
    },
    created(){
        this.getConfiguration()
    },
    methods:{
        getConfiguration(){
            this.$axios.get("/"+this.$route.params.username+"/api/Configurations?access_token="+this.$store.state.token+"&filter[where][alias]=manage_transport")
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
