<template>
    <v-form @submit.prevent="add" ref="form1" lazy-validation onkeypress="return event.keyCode != 13">
        <v-layout align-center justify-start row wrap>
            <v-flex xs12 sm12>
                <v-layout align-center row wrap>
                    <v-flex v-if="biggerScreen" xs12 sm2 class="text-xs-left">
                        <label v-if="mode == 'customer'" class="font-15 font-weight-regular">Customer Name: </label>
                        <label v-if="mode == 'supplier'" class="font-15 font-weight-regular">Supplier Name: </label>
                    </v-flex>
                    <v-flex xs12 sm4>
                        <v-text-field  class="pa-0 ma-0" type=text :rules="requiredRules"
                                    :single-line="biggerScreen" v-model="customerDetails.firstName"></v-text-field>
                    </v-flex>
                    <v-flex v-if="biggerScreen" xs12 sm2 class="text-lg-center text-xs-left">
                        <label class="font-15 font-weight-regular">Gstn: </label>
                    </v-flex>
                    <v-flex xs12 sm4>
                        <v-text-field label="" type=text :single-line="biggerScreen" class="pa-0 ma-0" v-model="customerDetails.gstn"></v-text-field>
                    </v-flex>
                </v-layout>
            </v-flex>
            <v-flex sm12>
                <v-layout align-center row wrap>
                    <v-flex v-if="biggerScreen" xs12 sm2 class="text-xs-left">
                        <label class="font-15 font-weight-regular">Mobile No: </label>
                    </v-flex>
                    <v-flex xs12 sm4>
                        <v-text-field label="" type=number :single-line="biggerScreen" :rules="requiredRules" class="pa-0 ma-0"
                            v-model="customerDetails.mobile"></v-text-field>
                    </v-flex>
                    <v-flex v-if="biggerScreen" xs12 sm2 class="text-lg-center text-xs-left">
                        <label class="font-15 font-weight-regular">Email: </label>
                    </v-flex>
                    <v-flex xs12 sm4>
                        <v-text-field label="" type=text :single-line="biggerScreen" class="pa-0 ma-0" v-model="customerDetails.email"></v-text-field>
                    </v-flex>
                </v-layout>
            </v-flex>
            <v-flex sm12>
                <v-layout align-center row wrap>
                    <v-flex v-if="biggerScreen" xs12 sm2 class="text-xs-left">
                        <label class="font-15 font-weight-regular">Street: </label>
                    </v-flex>
                    <v-flex xs12 sm10>
                        <v-textarea solo full-width rows="3" :single-line="biggerScreen" class="pa-0 ma-0" hint="Enter Street Address"
                            v-model="customerDetails.street"></v-textarea>
                    </v-flex>
                </v-layout>
            </v-flex>
            <v-flex sm12>
                <v-layout align-center row wrap>
                    <v-flex v-if="biggerScreen" xs12 sm2 class="text-xs-left">
                        <label class="font-15 font-weight-regular">Area: </label>
                    </v-flex>
                    <v-flex xs12 sm4>
                        <v-text-field label="" type=text :single-line="biggerScreen" class="pa-0 ma-0" v-model="customerDetails.area"></v-text-field>
                    </v-flex>
                    <v-flex v-if="biggerScreen" xs12 sm2 class="text-lg-center text-xs-left">
                        <label class="font-15 font-weight-regular">Pincode: </label>
                    </v-flex>
                    <v-flex xs12 sm4>
                        <v-text-field label="" type=text :single-line="biggerScreen" class="pa-0 ma-0" v-model="customerDetails.pinCode"></v-text-field>
                    </v-flex>
                </v-layout>
            </v-flex>
            <v-flex sm12>
                <v-layout align-center row wrap>
                    <v-flex v-if="biggerScreen" xs12 sm2 class="text-xs-left">
                        <label class="font-15 font-weight-regular">City: </label>
                    </v-flex>
                    <v-flex xs12 sm4>
                        <v-text-field label="" type=text :single-line="biggerScreen" class="pa-0 ma-0" v-model="customerDetails.city"></v-text-field>
                    </v-flex>
                    <v-flex v-if="biggerScreen" xs12 sm2 class="text-lg-center text-xs-left">
                        <label class="font-15 font-weight-regular">State: </label>
                    </v-flex>
                    <v-flex xs12 sm4>
                        <v-text-field label="" type=text :single-line="biggerScreen" class="pa-0 ma-0" v-model="customerDetails.state"></v-text-field>
                    </v-flex>
                </v-layout>
            </v-flex>
            <v-flex sm12>
                <v-layout align-center row wrap>
                    <v-flex v-if="biggerScreen" xs12 sm2 class="text-xs-left">
                        <label class="font-15 font-weight-regular">State Code: </label>
                    </v-flex>
                    <v-flex xs12 sm3>
                        <v-text-field label="" type=text :single-line="biggerScreen" class="pa-0 ma-0" v-model="customerDetails.stateCode"></v-text-field>
                    </v-flex>
                    <v-flex v-if="biggerScreen" xs12 sm3 class="text-lg-center text-xs-left">
                        <label class="font-15 font-weight-regular">Opening Balance: </label>
                    </v-flex>
                    <v-flex xs12 sm4>
                        <v-text-field label="" type=number :single-line="biggerScreen" class="pa-0 ma-0" v-model="customerDetails.balance"></v-text-field>
                    </v-flex>
                </v-layout>
            </v-flex>
            <v-flex sm12>
                <v-layout align-center row wrap>
                    <v-flex xs12 sm12>
                        <v-layout align-start justify-end row wrap>
                        <v-btn v-if="propCheck==0" class="" :loading="btnLoading" type="submit" color="info" round dark
                            @click="">
                            Add
                        </v-btn>
                        <v-btn v-else class="" :loading="btnLoading" type="submit" color="info" round dark @click="">
                            Save
                            <v-icon dark right class="ml-1">check_circle</v-icon>

                        </v-btn>
                        </v-layout>
                    </v-flex>
                </v-layout>
            </v-flex>
        </v-layout>
    </v-form>

</template>
<script>
    export default {
        //layout : "dashboard_ly",
        props: {
            id: {
                type: String,
                required: false
            },
            mode:{
                type: String,
                required: true
            },
            value: {
                type: Number,
                required: false
            }
        },
        created() {
            if (this.id != null) {
                this.propCheck = 1
                this.fillData()
            }
        },
        data() {
            return {
                customerDetails: {
                    
                    firstName: "",
                    mobile: "",
                    email: "",
                    street: "",
                    area: "",
                    pinCode: null,
                    city: "",
                    state: "",
                    gstn: "",
                    stateCode: null,
                    balance:null
                },
                requiredRules: [
                    v => !!v || 'This Field is required'
                ],
                biggerScreen: true,
                btnLoading: false,
                editCustomerDtl: [],
                propCheck: 0
            }
        },
        methods: {
            async add() {
                if (this.$refs.form1.validate()) {
                    if (this.propCheck == 0) {
                        this.btnLoading = true
                        
                        if(this.mode == 'customer')
                        {
                            await this.$axios.post("/" + this.$route.params.username + "/api/Customers?access_token=" + this.$store.state.token, {
                                name: this.customerDetails.firstName,
                                mobile: this.customerDetails.mobile,
                                email: this.customerDetails.email,
                                gstin: this.customerDetails.gstn,
                                street: this.customerDetails.street,
                                area: this.customerDetails.area,
                                city: this.customerDetails.city,
                                state: this.customerDetails.state,
                                pincode: this.customerDetails.pinCode,
                                statecode: this.customerDetails.stateCode,
                                isenabled: 1,
                                balance:this.customerDetails.balance,
                                createdon: new Date(new Date().getTime() - (new Date().getTimezoneOffset() * 60000)).toISOString(),
                                modifiedon: new Date(new Date().getTime() - (new Date().getTimezoneOffset() * 60000)).toISOString(),
                                createdById: this.$store.state.userId,
                                modifiedById: this.$store.state.userId,
                                customerTypeId: "0131ef88-91a1-4b63-9a5a-d5a36cd0252"

                            })
                            .then(res => {
                            if (res) {
                                this.btnLoading = false
                                this.$emit('input', 2);
                                }
                            });
                        }
                        else if (this.mode == 'supplier')
                        {
                            await this.$axios.post("/" + this.$route.params.username + "/api/Suppliers?access_token=" + this.$store.state.token, {
                                name: this.customerDetails.firstName,
                                mobile: this.customerDetails.mobile,
                                email: this.customerDetails.email,
                                gstin: this.customerDetails.gstn,
                                street: this.customerDetails.street,
                                area: this.customerDetails.area,
                                city: this.customerDetails.city,
                                state: this.customerDetails.state,
                                pincode: this.customerDetails.pinCode,
                                statecode: this.customerDetails.stateCode,
                                balance:this.customerDetails.balance,
                                isenabled: 1,
                                createdon: new Date(new Date().getTime() - (new Date().getTimezoneOffset() * 60000)).toISOString(),
                                modifiedon: new Date(new Date().getTime() - (new Date().getTimezoneOffset() * 60000)).toISOString(),
                                createdById: this.$store.state.userId,
                                modifiedById: this.$store.state.userId
                            })
                            .then(res => {
                            if (res) {
                                this.btnLoading = false
                                this.$emit('input', 2);
                                }
                            });
                        }
                    }
                    else {
                        this.btnLoading = true
                        
                        if(this.mode == 'customer') {
                            await this.$axios.post("/" + this.$route.params.username + "/api/Customers/update?access_token=" + this.$store.state.token + "&where[id]=" + this.id,
                            {
                                name: this.customerDetails.firstName,
                                mobile: this.customerDetails.mobile,
                                email: this.customerDetails.email,
                                gstin: this.customerDetails.gstn,
                                street: this.customerDetails.street,
                                area: this.customerDetails.area,
                                city: this.customerDetails.city,
                                state: this.customerDetails.state,
                                pincode: this.customerDetails.pinCode,
                                statecode: this.customerDetails.stateCode,
                                balance:this.customerDetails.balance,
                                isenabled: 1,
                                modifiedon: new Date(new Date().getTime() - (new Date().getTimezoneOffset() * 60000)).toISOString(),
                                modifiedById: this.$store.state.userId,
                                customerTypeId: "0131ef88-91a1-4b63-9a5a-d5a36cd0252"
                            })
                            .then(res1 => {
                                if (res1) {
                                    //alert("Customer Succesfully Edited and Saved")
                                    //window.location=""
                                    this.btnLoading = false
                                    this.$emit('input', 2);
                                }
                            });
                        }
                        else if(this.mode == 'supplier')
                        {
                            await this.$axios.post("/" + this.$route.params.username + "/api/Suppliers/update?access_token=" + this.$store.state.token + "&where[id]=" + this.id,
                            {
                                name: this.customerDetails.firstName,
                                mobile: this.customerDetails.mobile,
                                email: this.customerDetails.email,
                                gstin: this.customerDetails.gstn,
                                street: this.customerDetails.street,
                                area: this.customerDetails.area,
                                city: this.customerDetails.city,
                                state: this.customerDetails.state,
                                pincode: this.customerDetails.pinCode,
                                statecode: this.customerDetails.stateCode,
                                balance:this.customerDetails.balance,
                                isenabled: 1,
                                modifiedon: new Date(new Date().getTime() - (new Date().getTimezoneOffset() * 60000)).toISOString(),
                                modifiedById: this.$store.state.userId
                            })
                            .then(res1 => {
                                if (res1) {
                                    //alert("Customer Succesfully Edited and Saved")
                                    //window.location=""
                                    this.btnLoading = false
                                    this.$emit('input', 2);
                                }
                            });
                        }
                    }
                }
            },
            async fillData() {
                if(this.mode == 'customer')
                {
                    await this.$axios.get("/" + this.$route.params.username + "/api/Customers/" + this.id + "?access_token=" + this.$store.state.token)
                    .then(res => {
                        this.editCustomerDtl = res.data;
                        this.customerDetails.firstName=this.editCustomerDtl.name;
                        this.customerDetails.mobile = this.editCustomerDtl.mobile;
                        this.customerDetails.email = this.editCustomerDtl.email;
                        this.customerDetails.street = this.editCustomerDtl.street;
                        this.customerDetails.area = this.editCustomerDtl.area;
                        this.customerDetails.pinCode = this.editCustomerDtl.pincode;
                        this.customerDetails.city = this.editCustomerDtl.city;
                        this.customerDetails.state = this.editCustomerDtl.state;
                        this.customerDetails.gstn = this.editCustomerDtl.gstin;
                        this.customerDetails.stateCode = this.editCustomerDtl.statecode;
                        this.customerDetails.balance=this.editCustomerDtl.balance
                    });
                }
                else if (this.mode == 'supplier')
                {
                    await this.$axios.get("/" + this.$route.params.username + "/api/Suppliers/" + this.id + "?access_token=" + this.$store.state.token)
                    .then(res => {
                        this.editCustomerDtl = res.data;
                        this.customerDetails.firstName=this.editCustomerDtl.name;                        
                        this.customerDetails.mobile = this.editCustomerDtl.mobile;
                        this.customerDetails.email = this.editCustomerDtl.email;
                        this.customerDetails.street = this.editCustomerDtl.street;
                        this.customerDetails.area = this.editCustomerDtl.area;
                        this.customerDetails.pinCode = this.editCustomerDtl.pincode;
                        this.customerDetails.city = this.editCustomerDtl.city;
                        this.customerDetails.state = this.editCustomerDtl.state;
                        this.customerDetails.gstn = this.editCustomerDtl.gstin;
                        this.customerDetails.stateCode = this.editCustomerDtl.statecode;
                    });
                }
            }
        }
    }
</script>
<style>
    input[type=number]::-webkit-inner-spin-button,
    input[type=number]::-webkit-outer-spin-button {
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;
        margin: 0;
    }
</style>