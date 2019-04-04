<template>
    <v-card flat>
        <v-card-text class="grey lighten-2 ">
        <v-card style="border-radius:5px 5px 0 0;" class="tab-display-none">
            <v-card-text class=" pb-0">
                <v-layout align-center justify-start row wrap>
                    <v-flex xs12 sm6 class="mb-1">
                        <label class="font-24 pb-0 mb-1 text-capitalize"><b>{{customerDtl.name}}</b></label>
                        <v-subheader style="height:20px;">GST:- {{customerDtl.gstin}}</v-subheader>
                    </v-flex>
                    <v-flex xs12 sm6 class="mb-1">
                        <v-layout row wrap>
                            <v-flex sm6 class="mb-1"></v-flex>
                            <v-flex xs12 sm6 text-xs-right class="mb-1">
                                <label class="font-15 font-weight-regular"><b>Total Transactions: </b></label>
                                <span style="text-align:right;">{{totalTrans}}</span>
                            </v-flex>
                            <v-flex sm6 class="mb-1"></v-flex>
                            <v-flex xs12 sm6 text-xs-right class="mb-1">
                                <label class="font-15 font-weight-regular"><b>Total Amount: </b></label>
                                {{customerDtl.totalamount}}
                            </v-flex>
                            <v-flex sm6 class="mb-1"></v-flex>
                            <v-flex v-if="mode == 'customer'" xs12 sm6 text-xs-right class="mb-1">
                                <label class="font-15 font-weight-regular"><b>Amount Received: </b></label>
                                {{customerDtl.received}}
                            </v-flex>
                            <v-flex v-else-if="mode == 'supplier'" xs12 sm6 text-xs-right class="mb-1">
                                <label class="font-15 font-weight-regular"><b>Amount Paid: </b></label>
                                {{customerDtl.paid}}
                            </v-flex>
                            <v-flex sm6 ></v-flex>
                            <v-flex v-if="mode == 'customer'" xs12 sm6 text-xs-right>
                                <label class="font-15 font-weight-regular"><b>Amount Receivable: </b></label>
                                {{customerDtl.totalamount-customerDtl.received}}
                            </v-flex>
                            <v-flex v-else-if="mode == 'supplier'" xs12 sm6 text-xs-right>
                                <label class="font-15 font-weight-regular"><b>Amount Payable: </b></label>
                                {{customerDtl.totalamount-customerDtl.paid}}
                            </v-flex>
                        </v-layout>
                    </v-flex>
                </v-layout>
            </v-card-text>
        </v-card>
        <v-layout row wrap>
            <v-flex xs12 sm12 text-xs-center>
                <div>
                    <v-tabs v-model="tab" class="tab-display-none"  color="white" light>
                        <v-tabs-slider color="black"></v-tabs-slider>                        
                        <v-tab>About</v-tab>
                        <v-tab>All Orders</v-tab>
                    </v-tabs>   
                        
                     <v-tabs-items v-model="tab" touchless>
                            <v-tab-item v-for="(n,index) in 2" :key="index" >
                                <v-card v-if="index==0" class="mt-3 border-radius-5">
                                    <v-card-text>
                                        <csAddComponent v-model="closeModal1"  :mode="mode" :id="id"></csAddComponent>
                                    </v-card-text>    
                                </v-card>
                                <orderListing v-else class="mt-3" :mode="mode" :startDate="startDate" :endDate="endDate" :csid="id"/> 
                            </v-tab-item>
                        </v-tabs-items>    
                </div>
            </v-flex>
        </v-layout>
    </v-card-text>
    </v-card>    
</template>

<script>
    import csAddComponent from "~/components/csAddComponent";
  import orderListing from '@/components/orderListingComponent';
    export default {
        props:{
            mode:{
                type:String,
                required:true
            },
            id:{
                type:String,
                required:true
            }
        },
        components: {
            //editCustomer,
            csAddComponent,
            orderListing
        },
        data() {
            return {
                tab:null,
                customerDtl: [],
                closeModal1: 1,
                startDate:null,
                endDate:null,
                totalTrans:0
            }
        },
        created() {
            this.generate()
        },
        
        updated(){
            
            if (this.closeModal1 == 2) {
                //this.showModal = false
                this.$store.commit('snackbar/setSnack','Details Saved');
                //this.generate();
                if(this.mode == 'customer') {
                    this.$axios.get("/" + this.$route.params.username + "/api/Customers/" + this.id + "?access_token=" + this.$store.state.token)
                        .then(res => {
                            this.customerDtl = res.data;
                            //this.loading=false
                            this.closeModal1=1;
                        });
                }
                else if(this.mode == 'supplier') {
                    this.$axios.get("/" + this.$route.params.username + "/api/Suppliers/" + this.id + "?access_token=" + this.$store.state.token)
                    .then(res => {
                        this.customerDtl = res.data;
                        //this.loading=false
                        this.closeModal1=1;
                    });
                }
            }
        },
        methods: {
    
            generate() {
                let date=new Date();
                let month=date.getMonth();
                let year=date.getFullYear();
                let date1=""+new Date(year, month+1, 0).getDate();
                let date2=""+new Date(year, month, 1).getDate();
                if((date.getMonth()+1) < 10) month="0"+(date.getMonth()+1)
                if(date2 <10) date2="0"+date2;
                this.startDate=year+"-"+month+"-"+date2;
                this.endDate=year+"-"+month+"-"+date1;
                if(this.mode == 'customer')
                {
                    this.$axios.get("/" + this.$route.params.username + "/api/Customers/" + this.id + "?access_token=" + this.$store.state.token)
                    .then(res => {
                        this.$axios.get("/" + this.$route.params.username + "/api/Orders/count?access_token=" + this.$store.state.token+"&where[isenabled]=1&where[customerId]="+ this.id)
                        .then(res1 => {
                            this.customerDtl = res.data;
                            this.totalTrans=res1.data.count;
                        });
                    });
                }
                else if(this.mode == 'supplier')
                {
                    this.$axios.get("/" + this.$route.params.username + "/api/Suppliers/" + this.id + "?access_token=" + this.$store.state.token)
                    .then(res => {
                        this.$axios.get("/" + this.$route.params.username + "/api/Purchases/count?access_token=" + this.$store.state.token+"&where[isenabled]=1&where[supplierId]="+ this.id)
                        .then(res1 => {
                            this.customerDtl = res.data;
                            this.totalTrans=res1.data.count;
                        });
                    });
                }
            },
        }
    }
</script>
