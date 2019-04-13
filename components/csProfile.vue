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
                                <v-flex sm6 class="mb-1"></v-flex>
                                <v-flex v-if="mode == 'customer'" xs12 sm6 text-xs-right class="mb-1">
                                    <label class="font-15 font-weight-regular"><b>Amount Receivable: </b></label>
                                    {{customerDtl.totalamount-customerDtl.received}}
                                </v-flex>
                                <v-flex v-else-if="mode == 'supplier'" xs12 sm6 text-xs-right class="mb-1">
                                    <label class="font-15 font-weight-regular"><b>Amount Payable: </b></label>
                                    {{customerDtl.totalamount-customerDtl.paid}}
                                </v-flex>
                                <v-flex sm6></v-flex>
                                <v-flex xs12 sm6 text-xs-right>
                                    <label class="font-15 font-weight-regular"><b>Balance Remaining: </b></label>
                                    {{customerDtl.closingbal}}
                                </v-flex>
                            </v-layout>
                        </v-flex>
                    </v-layout>
                </v-card-text>
            </v-card>
            <v-layout row wrap>
                <v-flex xs12 sm12 text-xs-center>
                    <div>
                        <v-tabs v-model="tab" class="tab-display-none" color="white" light>
                            <v-tabs-slider color="black"></v-tabs-slider>
                            <v-tab v-for="(item,index) in items" :key="index" :href="`#tab-${index+1}`">
                                {{ item.name }}
                            </v-tab>
                        </v-tabs>

                        <v-tabs-items v-model="tab" touchless>
                            <v-tab-item v-for="(n,index) in items" :key="index" :value="`tab-${index+1}`">
                                <v-card v-if="index==0" class="mt-3 border-radius-5">
                                    <v-card-text>
                                        <v-layout align-start justify-end row wrap>
                                            <v-btn color="info" round class="mb-3" @click="showModal=true">
                                                <v-icon dark small class="mr-1">settings</v-icon> Settings
                                            </v-btn>
                                        </v-layout>
                                        <v-card v-if="index==0" class="grey lighten-4 border-radius-5">
                                            <v-card-text>
                                                <csAddComponent v-model="closeModal1" :mode="mode" :id="id"></csAddComponent>
                                            </v-card-text>
                                        </v-card>
                                    </v-card-text>
                                </v-card>
                                <orderListing v-else-if="index==1" class="mt-3" :mode="mode" :startDate="startDate"
                                    :endDate="endDate" :csid="id" />
                                <BalanceLogs v-else-if="index == 2" class="mt-3" :mode="mode" :id="id" />

                            </v-tab-item>
                        </v-tabs-items>
                    </div>
                </v-flex>
            </v-layout>
            <v-dialog width="450" v-model="showModal">
                <v-card>
                    <v-card-title class="pt-2 pb-2" style="border-bottom:1px solid #A5A5A5;">
                        <span style="font-size:18px;">Settings</span>
                    </v-card-title>
                    <v-card-text class="pa-0">
                        <v-container grid-list-xs>
                            <v-form @submit.prevent="setReminder" ref="form" lazy-validation onkeypress="return event.keyCode != 13"
                                v-model="valid">
                                <v-layout align-center justify-start row wrap>
                                    <v-flex xs12 sm4 class="text-lg-left">
                                        <label class="font-15 font-weight-regular">SMS Reminder: </label>
                                    </v-flex>
                                    <v-flex xs3 sm2>
                                        <v-switch v-model="reminder" label=""></v-switch>
                                    </v-flex>
                                    <v-flex xs9 sm6>
                                        <v-text-field v-if="reminder != false" :rules="requiredRules" type="number"
                                            class="pa-0" v-model.number="noofdays" label="No of Days" height=20 min="1"></v-text-field>
                                    </v-flex>
                                </v-layout>
                                <v-layout align-start justify-end row wrap>
                                    <v-btn color="info" :loading="btnLoading" round class="mb-1" type="submit">
                                        Save</v-btn>
                                </v-layout>
                            </v-form>
                        </v-container>
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
        </v-card-text>
    </v-card>
</template>

<script>
    import csAddComponent from "~/components/csAddComponent";
    import orderListing from '@/components/orderListingComponent';
    import BalanceLogs from '@/components/csBalanceLogs';


    export default {
        props: {
            mode: {
                type: String,
                required: true
            },
            id: {
                type: String,
                required: true
            }
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
        components: {
            //editCustomer,
            csAddComponent,
            orderListing,
            BalanceLogs
        },
        data() {
            return {
                tab: null,
                customerDtl: [],
                items: [
                    { name:'About' },
                    { name: 'All Orders' },
                    { name: 'Transactions'}
                ],
                closeModal1: 1,
                startDate: null,
                endDate: null,
                totalTrans: 0,
                btnLoading: false,
                showModal: false,
                reminder: false,
                valid: false,
                noofdays: 0,
                requiredRules: [
                    v => !!v || 'This Field is required and value should be more than 0'
                ]


            }
        },
        created() {
            this.generate()
        },

        updated() {

            if (this.closeModal1 == 2) {
                //this.showModal = false
                this.$store.commit('snackbar/setSnack', 'Details Saved');
                //this.generate();
                if (this.mode == 'customer') {
                    this.$axios.get("/" + this.$route.params.username + "/api/Customers/" + this.id + "?access_token=" + this.$store.state.token)
                        .then(res => {
                            this.customerDtl = res.data;
                            //this.loading=false
                            this.closeModal1 = 1;
                        });
                }
                else if (this.mode == 'supplier') {
                    this.$axios.get("/" + this.$route.params.username + "/api/Suppliers/" + this.id + "?access_token=" + this.$store.state.token)
                        .then(res => {
                            this.customerDtl = res.data;
                            //this.loading=false
                            this.closeModal1 = 1;
                        });
                }
            }
        },
        methods: {

            generate() {
                let date = new Date();
                let month = date.getMonth();
                let year = date.getFullYear();
                let date1 = "" + new Date(year, month + 1, 0).getDate();
                let date2 = "" + new Date(year, month, 1).getDate();
                if ((date.getMonth() + 1) < 10) month = "0" + (date.getMonth() + 1)
                if (date2 < 10) date2 = "0" + date2;
                this.startDate = year + "-" + month + "-" + date2;
                this.endDate = year + "-" + month + "-" + date1;
                if (this.mode == 'customer') {
                    this.$axios.get("/" + this.$route.params.username + "/api/Customers/" + this.id + "?access_token=" + this.$store.state.token)
                        .then(res => {
                            this.$axios.get("/" + this.$route.params.username + "/api/Orders/count?access_token=" + this.$store.state.token + "&where[isenabled]=1&where[customerId]=" + this.id)
                                .then(res1 => {
                                    this.customerDtl = res.data;
                                    this.totalTrans = res1.data.count;
                                    if (this.customerDtl.noofdays == -1) {
                                        this.reminder = false;
                                        this.noofdays = 0
                                    }
                                    else {
                                        this.reminder = true;
                                        this.noofdays = this.customerDtl.noofdays
                                    }
                                });
                        });
                }
                else if (this.mode == 'supplier') {
                    this.$axios.get("/" + this.$route.params.username + "/api/Suppliers/" + this.id + "?access_token=" + this.$store.state.token)
                        .then(res => {
                            this.$axios.get("/" + this.$route.params.username + "/api/Purchases/count?access_token=" + this.$store.state.token + "&where[isenabled]=1&where[supplierId]=" + this.id)
                                .then(res1 => {
                                    this.customerDtl = res.data;
                                    this.totalTrans = res1.data.count;
                                });
                        });
                }
            },
            setReminder() {
                if (this.$refs.form.validate()) {
                    this.btnLoading - true;
                    if (this.reminder == false) {
                        this.$axios.post("/" + this.$route.params.username + "/api/Customers/update?access_token=" + this.$store.state.token + "&where[id]=" + this.id,
                            {
                                noofdays: -1
                            }).then(res => {
                                this.showModal = false;
                                this.generate();
                            });
                    }
                    else {
                        this.$axios.post("/" + this.$route.params.username + "/api/Customers/update?access_token=" + this.$store.state.token + "&where[id]=" + this.id,
                            {
                                noofdays: this.noofdays
                            }).then(res => {
                                this.showModal = false;
                                this.generate();
                            });
                    }
                }
            }

        }
    }
</script>