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
                                <smsGroup v-if="index == 1" class="mt-3" />
                                <smsLogs v-else-if="index == 0" class="mt-3" />
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
        mounted(){
            if(this.$route.hash.search("tab") > -1)
            {
                this.tab = this.$route.hash.substr(1)
            }
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
                ]
            }
        }
    }
</script>