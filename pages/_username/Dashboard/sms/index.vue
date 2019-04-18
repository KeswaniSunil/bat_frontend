<template>
    <v-layout row wrap>
        <v-flex xs12 text-xs-center>
            <div>
                <v-tabs v-model="tab" class="tab-display-none" color="white" grow light>
                    <v-tabs-slider color="black"></v-tabs-slider>
                    <v-tab v-for="(item,index) in items" :key="index" :href="`#tab-${index+1}`">
                        {{item.name}}
                    </v-tab>
                </v-tabs>
                <v-tabs-items v-model="tab" touchless>
                    <v-tab-item v-for="(n,index) in items" :key="index" :value="`tab-${index+1}`">
                        <v-card flat>
                            <v-card-text class="body-background padding-xs">
                                <v-alert :value="!sms" >
                                    Please fill SMS Details from Company Profile page first to send SMS.
                                </v-alert>
                                <smsGroup v-if="index == 1" class="mt-3" />
                                <smsLogs v-else-if="index == 0" class="mt-3" :sendsms="sms" />
                                <smsTemplate v-else-if="index == 2" class="mt-3" />

                            </v-card-text>
                        </v-card>
                    </v-tab-item>
                </v-tabs-items>
            </div>
        </v-flex>
    </v-layout>
</template>
<script>
    import smsGroup from "@/components/sms/viewSmsGroup";
    import smsTemplate from "@/components/sms/viewSmsTemplate";
    import smsLogs from "@/components/sms/smsLogs";
    export default {
        layout: 'dashboard',
        components: {
            smsGroup,
            smsLogs,
            smsTemplate
        },
        created(){
            this.getConfiguration()
        },
        mounted(){
            if(this.$route.hash.search("tab") > -1)
            {
                this.tab = this.$route.hash.substr(1)
            }
            this.getDetails()
        },
        beforeUpdate(){
            if(this.$route.query.startDate != null && this.$route.query.endDate != null)
            {
                this.$router.push(new String(this.$route.fullPath).replace(this.$route.hash,"#"+this.tab))
            }
            else {
                this.$router.push("#"+this.tab)
            }
        },
        data() {
            return {
                tab: null,
                items: [
                    { name:'SMS' },
                    { name: 'SMS Group' },
                    { name: 'Templates'}
                ],
                sms:false
            }
        },
        methods:{
            getDetails(){
                this.$axios.get("/" + this.$route.params.username + "/api/Details?access_token=" + this.$store.state.token)
                .then(res => {
                    if(res.data[0].sms){
                        if(res.data[0].route != "" && res.data[0].route != null &&res.data[0].apikey != "" && res.data[0].apikey != null){
                            this.sms = true
                        }
                        else{
                            this.sms = false
                        }
                    }
                    else this.sms=false
                })
            },
            getConfiguration(){
                this.$axios.get("/"+this.$route.params.username+"/api/Configurations?access_token="+this.$store.state.token+"&filter[where][alias]=manage_sms")
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