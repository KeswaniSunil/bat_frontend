<template>
    <v-card flat>
        <v-card-text class="body-background padding-xs">
            <MonthlyRecord mode="sale" ui="dashboard" class="mb-3" />
            <MonthlyRecord mode="purchase" ui="dashboard" class="mb-3" />
            <v-card class="border-radius-5 mb-3">
                <v-card-text>
                    <v-layout justify-start row wrap>
                    <v-flex xs5 sm3 md2 v-for="(i,index) in 5" :key="index" @click="view(index)" class="ma-2">
                        <v-hover v-if="index%2==0" style="transition:0.8s">
                            <v-card slot-scope="{ hover }"
                                :class="`elevation-${hover ? 10 : 3}`"
                                class="border-radius-5 black"
                                style="cursor:pointer">
                                <v-img src="/img/login-bg/gallery-15-thumb.jpg" gradient="to top right,rgba(88,97,105,0.8),rgba(45,53,60,0.8)">
                                    <v-container fill-height fluid pa-2>
                                        <v-layout fill-height align-center justify-center row wrap>
                                            <v-flex xs12 flexbox text-xs-left>
                                                <span class="white--text font-20" v-if="index==0">{{total_cust}}</span>
                                                <span class="white--text font-20" v-else-if="index==2">{{total_sale}}</span>
                                                <span class="white--text font-20" v-else-if="index==4">{{total_item}}</span>

                                            </v-flex>
                                            <v-flex xs12 flexbox text-xs-left>
                                                <div class="grey--text text--lighten-1 font-weight-bold font-14" v-if="index==0" >Total Customers</div>
                                                <div class="grey--text text--lighten-1 font-weight-bold font-14" v-else-if="index==2">Total Sales</div>
                                                <div class="grey--text text--lighten-1 font-weight-bold font-14" v-else-if="index==4">Total Items</div>
                                            </v-flex>
                                        </v-layout>
                                    </v-container>
                                </v-img>
                            </v-card>
                        </v-hover>
                        <v-hover v-else style="transition:0.8s">
                            <v-card slot-scope="{ hover }"
                                :class="`elevation-${hover ? 10 : 3}`"
                                class="border-radius-5 black"
                                style="cursor:pointer">
                                <v-img src="/img/login-bg/gallery-15-thumb.jpg" gradient="to top right,rgba(25,120,201,.8), rgba(25,32,72,.8)">                                
                                    <v-container fill-height fluid pa-2>
                                        <v-layout fill-height align-center justify-center row wrap>
                                            <v-flex xs12 flexbox text-xs-left>
                                                <span class="white--text font-20" v-if="index==1">{{total_supp}}</span>
                                                <span class="white--text font-20" v-else-if="index==3">{{total_purc}}</span>
                                            </v-flex>
                                            <v-flex xs12 flexbox text-xs-left>
                                                <div class="grey--text text--lighten-1 font-weight-bold font-14" v-if="index==1">Total Suppliers</div>
                                                                                                <div class="grey--text text--lighten-1 font-weight-bold font-14" v-else-if="index==3">Total Purchases</div>
                                            </v-flex>
                                        </v-layout>
                                    </v-container>
                                </v-img>
                            </v-card>
                        </v-hover>
                    </v-flex>    
                    </v-layout>
                </v-card-text>
            </v-card>
            <v-layout row wrap>
                <v-flex xs12 sm3 class="margin-xs mb-3">
                    <v-card class="border-radius-5">
                        <v-card-text>
                            <label class="font-16">Total Recievables</label>
                            <v-layout align-start justify-center row>
                                <v-progress-circular :rotate="-90" :size="130" :width="15" :value="value_rec" color="info">
                                    {{ value_rec }}%
                                </v-progress-circular>
                            </v-layout>
                            <v-layout align-start justify-start row>
                                <label class="font-14">Total Amount = {{recievable.total}}</label>

                            </v-layout>
                            <v-layout align-start justify-start row>
                                <label class="font-14">Recieved=
                                    {{recievable.recieved}}({{Math.round(((recievable.recieved*100)/recievable.total))}}%)</label>
                            </v-layout>
                        </v-card-text>
                    </v-card>
                </v-flex>
                <v-flex xs12 sm3 class="margin-xs mb-3">
                    <v-card class="border-radius-5">
                        <v-card-text>
                            <label class="font-16">Total Payables</label>
                            <v-layout align-start justify-center row>
                                <v-progress-circular :rotate="-90" :size="130" :width="15" :value="value_pay" color="info">
                                    {{ value_pay }}%
                                </v-progress-circular>
                            </v-layout>
                            <v-layout align-start justify-start row>
                                <label class="font-14">Total Amount = {{payable.total}}</label>

                            </v-layout>
                            <v-layout align-start justify-start row>
                                <label class="font-14">Paid=
                                    {{payable.paid}}({{Math.round(((payable.paid*100)/payable.total))}}%)</label>
                            </v-layout>
                        </v-card-text>
                    </v-card>
                </v-flex>
                <v-flex sm6></v-flex>
            </v-layout>    
        </v-card-text>
    </v-card>
</template>
<script>
    import MonthlyRecord from "@/components/MonthlyRecord";
    export default {
        layout: 'dashboard',
        components: {
            MonthlyRecord
        },
        data() {
            return {
                value_rec: 0,
                recievable: [],
                value_pay: 0,
                payable: [],
                total_cust:0,
                total_supp:0,
                total_purc:0,
                total_sale:0,
                total_item:0
            }
        },
        created() {
            this.generate()
        },
        methods: {
            generate() {
                this.$axios.get("/" + this.$route.params.username + "/api/Customers/getRecievables?access_token=" + this.$store.state.token)
                    .then(res => {
                        this.$axios.get("/" + this.$route.params.username + "/api/Suppliers/getPayables?access_token=" + this.$store.state.token)
                            .then(res1 => {
                                this.recievable = res.data.total[0]
                                if (this.recievable.total > 0) {
                                    this.value_rec = Math.round((((this.recievable.total - this.recievable.recieved) * 100) / this.recievable.total))
                                }
                                this.payable = res1.data.total[0]
                                if (this.payable.total > 0) {
                                    this.value_pay = Math.round((((this.payable.total - this.payable.paid) * 100) / this.payable.total))
                                }
                                this.getAll();

                            });
                    })
            },
            getAll(){
                this.$axios.get("/" + this.$route.params.username + "/api/Customers/count?access_token=" + this.$store.state.token+"&where[isenabled]=1")
                    .then(res => {
                        this.$axios.get("/" + this.$route.params.username + "/api/Suppliers/count?access_token=" + this.$store.state.token+"&where[isenabled]=1")
                    .then(res1 => {
                        this.$axios.get("/" + this.$route.params.username + "/api/Items/count?access_token=" + this.$store.state.token+"&where[isenabled]=1")
                    .then(res2 => {
                        this.$axios.get("/" + this.$route.params.username + "/api/Orders/count?access_token=" + this.$store.state.token+"&where[isenabled]=1")
                    .then(res3 => {
                        this.$axios.get("/" + this.$route.params.username + "/api/Purchases/count?access_token=" + this.$store.state.token+"&where[isenabled]=1")
                    .then(res4 => {
                        this.total_cust=res.data.count
                        this.total_supp=res1.data.count
                        this.total_item=res2.data.count
                        this.total_sale=res3.data.count
                        this.total_purc=res4.data.count

                    });
                    });
                    });
                    });                        
                    });
            },
            view(index){
                if(index==0){
                    this.$router.push("/"+this.$route.params.username+"/Dashboard/sales#tab-2")
                }
                else if(index==1){
                    this.$router.push("/"+this.$route.params.username+"/Dashboard/purchase#tab-2")                    
                }
                else if(index==2){
                    this.$router.push("/"+this.$route.params.username+"/Dashboard/sales#tab-3")                    
                }
                else if(index==3){
                    this.$router.push("/"+this.$route.params.username+"/Dashboard/purchase#tab-3")
                    
                }
               else if(index==4){
                    this.$router.push("/"+this.$route.params.username+"/Dashboard/items#tab-1")
                    
                }
            }
        }
    }
</script>
<style lang="stylus" scoped>
    .v-progress-circular {
        margin: 1rem
    }
</style>