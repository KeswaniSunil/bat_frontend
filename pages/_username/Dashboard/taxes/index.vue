<template>
    <v-card flat>
        <v-card-text class="body-background padding-xs">
            <viewTax class="mt-3"/>
        </v-card-text>
    </v-card>
</template>
<script>
import viewTax from "~/components/tax/viewTax";
export default {
    layout:'dashboard',
    components:{
        viewTax
    },
    created(){
        this.getConfiguration()
    },
    methods:{
        getConfiguration(){
            this.$axios.get("/"+this.$route.params.username+"/api/Configurations?access_token="+this.$store.state.token)
            .then(res=>{
                if(res.data.length > 0) {
                    let tax = 0
                    for(let i=0;i<res.data.length;i++){
                        if(res.data[i].alias == 'calculate_taxes_sales' || res.data[i].alias == 'calculate_taxes_purchase')
                        {
                            if(res.data[i].value == 0) tax++
                        }
                    }
                    if(tax == 2) return this.$nuxt.error({ statusCode: 404, message: "Page Not Found" })
                }
            })
        }
    }
}
</script>
