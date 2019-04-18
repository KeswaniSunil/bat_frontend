<template>
    <v-layout row wrap>
        <v-flex xs12 sm12>

            <v-layout align-center justify-start row wrap>
                <v-flex xs12 sm12 class="pa-3">
                    <span style="font-size:25px;">Company Details</span>
                </v-flex>
            </v-layout>
            <v-form @submit.prevent="editDetail" ref="form" onkeypress="return event.keyCode != 13">
                <v-card class="border-radius-5 mr-3 mb-3 ml-3">
                    <v-card-text>
                        <v-layout justify-space-between @click="expand1 = !expand1" style="cursor: pointer">
                            <div class="font-18">Personal Details</div>
                            <v-icon v-if="!validPD" color="red">error</v-icon>
                            <div v-else>
                                <v-progress-circular v-if="pdval < 100" :value="pdval" :rotate="-90"></v-progress-circular>
                                <v-icon v-else color="green">check_circle</v-icon>
                            </div>
                        </v-layout>
                        <v-expand-transition mode="out-in">
                            <div v-show="expand1" class="mt-3">
                                <v-layout row wrap class="mb-1">
                                    <v-flex xs12 sm4>
                                        <v-layout row wrap>
                                            <v-flex xs12 sm11>
                                                <v-text-field type=text @keyup="checkPD()" label="Company Name" :rules="requiredRules" maxlength="20" v-model="companyDtl.name"></v-text-field>
                                            </v-flex>
                                            <v-flex sm1></v-flex>
                                        </v-layout>
                                    </v-flex>
                                    <v-flex xs12 sm4>
                                        <v-layout row wrap>
                                            <v-flex xs12 sm11>
                                                <v-text-field v-model="companyDtl.mobile" @keyup="checkPD()" :rules="numberRules" type=number label="Mobile No."></v-text-field>
                                            </v-flex>
                                            <v-flex sm1></v-flex>
                                        </v-layout>
                                    </v-flex>
                                    <v-flex xs12 sm4>
                                        <v-layout row wrap>
                                            <v-flex xs12 sm11>
                                                <v-text-field v-model="companyDtl.billuppertext" @keyup="checkPD()" :rules="requiredRules" label="Bill Upper Text"
                                                    type=text></v-text-field>
                                            </v-flex>
                                            <v-flex sm1></v-flex>
                                        </v-layout>
                                    </v-flex>
                                </v-layout>
                                <v-layout row wrap>
                                    <v-flex xs12 sm7>
                                        <v-textarea rows="3" label="Address" @keyup="checkPD()" v-model="companyDtl.address"></v-textarea>
                                    </v-flex>
                                    <v-flex sm5></v-flex>
                                </v-layout>
                                <v-layout row wrap>
                                    <v-flex xs12 sm3>
                                        <v-layout row wrap>
                                            <v-flex xs12 sm11>
                                                <v-text-field label="State" type=text @keyup="checkPD()" v-model="companyDtl.state"></v-text-field>
                                            </v-flex>
                                            <v-flex sm1></v-flex>
                                        </v-layout>
                                    </v-flex>
                                    <v-flex xs12 sm3>
                                        <v-layout row wrap>
                                            <v-flex xs12 sm11>
                                                <v-text-field label="City" type=text @keyup="checkPD()" v-model="companyDtl.city"></v-text-field>
                                            </v-flex>
                                            <v-flex sm1></v-flex>
                                        </v-layout>
                                    </v-flex>
                                    <v-flex xs12 sm3>
                                        <v-layout row wrap>
                                            <v-flex xs12 sm11>
                                                <v-text-field label="State Code" type=number @keyup="checkPD()" v-model="companyDtl.statecode"></v-text-field>
                                            </v-flex>
                                            <v-flex sm1></v-flex>
                                        </v-layout>
                                    </v-flex>
                                    <v-flex xs12 sm3>
                                        <v-layout row wrap>
                                            <v-flex xs12 sm11>
                                                <v-text-field type=text label="GSTN" @keyup="checkPD()" v-model="companyDtl.gstin"></v-text-field>
                                            </v-flex>
                                            <v-flex sm1></v-flex>
                                        </v-layout>
                                    </v-flex>
                                </v-layout>
                            </div>
                        </v-expand-transition>
                    </v-card-text>
                </v-card>
                <v-card class="border-radius-5 mr-3 mb-3 ml-3">
                    <v-card-text>
                        <v-layout justify-space-between @click="expand2 = !expand2" style="cursor: pointer">
                            <div class="font-18">Bank Details</div>
                            <div>
                                <v-progress-circular v-if="bdval < 100" :value="bdval" :rotate="-90"></v-progress-circular>
                                <v-icon v-else color="green">check_circle</v-icon>
                            </div>
                        </v-layout>
                        <v-expand-transition mode="out-in">
                            <div v-show="expand2" class="mt-3">
                                <v-layout row wrap class="mb-4">
                                    <v-flex xs12 sm3>
                                        <v-layout row wrap>
                                            <v-flex xs12 sm11>
                                                <v-text-field label="Bank Account No." @keyup="checkBD()" type=text v-model="bankDtl.accountno"></v-text-field>
                                            </v-flex>
                                            <v-flex sm1></v-flex>
                                        </v-layout>
                                    </v-flex>
                                    <v-flex xs12 sm3>
                                        <v-layout row wrap>
                                            <v-flex xs12 sm11>
                                                <v-text-field label="Bank Account Name" @keyup="checkBD()" type=text v-model="bankDtl.accountname"></v-text-field>
                                            </v-flex>
                                            <v-flex sm1></v-flex>
                                        </v-layout>
                                    </v-flex>
                                    <v-flex xs12 sm3>
                                        <v-layout row wrap>
                                            <v-flex xs12 sm11>
                                                <v-text-field label="Bank Name" type=text @keyup="checkBD()" v-model="bankDtl.name"></v-text-field>
                                            </v-flex>
                                            <v-flex sm1></v-flex>
                                        </v-layout>
                                    </v-flex>
                                    <v-flex xs12 sm3>
                                        <v-layout row wrap>
                                            <v-flex xs12 sm11>
                                                <v-text-field label="Bank IFSC" v-model="bankDtl.ifsc" @keyup="checkBD()" type=text></v-text-field>
                                            </v-flex>
                                            <v-flex sm1></v-flex>
                                        </v-layout>
                                    </v-flex>
                                </v-layout>
                            </div>
                        </v-expand-transition>
                    </v-card-text>
                </v-card>
                <v-card class="border-radius-5 mr-3 mb-3 ml-3">
                    <v-card-text>
                        <v-layout justify-space-between @click="expand3 = !expand3" style="cursor: pointer">
                            <div class="font-18">Company Terms</div>
                            <div>
                                <v-progress-circular v-if="ctval < 100" :value="ctval" :rotate="-90"></v-progress-circular>
                                <v-icon v-else color="green">check_circle</v-icon>
                            </div>
                        </v-layout>
                        <v-expand-transition mode="out-in">
                            <div v-show="expand3" class="mt-3">
                                <v-layout row wrap class="mb-1">
                                    <v-flex xs12 sm7>
                                        <v-textarea rows="3" label="Terms and Conditions" @keyup="checkCT()" v-model="companyDtl.tnc"></v-textarea>
                                    </v-flex>
                                    <v-flex sm5></v-flex>
                                </v-layout>
                            </div>
                        </v-expand-transition>
                    </v-card-text>
                </v-card>
                <v-card class="border-radius-5 mr-3 mb-3 ml-3">
                    <v-card-text>
                        <v-layout justify-space-between align-center>
                            <div class="font-18">SMS <v-icon></v-icon> </div>
                            <div>
                                <v-switch v-model="sms" height=0 ></v-switch>
                            </div>
                        </v-layout>
                        <v-expand-transition mode="out-in">
                            <div v-if="sms" class="mt-3">
                                <v-layout row wrap class="mb-1">
                                    <v-flex xs12 sm4>
                                        <v-layout row wrap>
                                            <v-flex xs12 sm11>
                                                <v-select label="Mode" :rules="requiredRules" :items="[{text:'Promotional',value:1},{text:'Transactional',value:4}]" v-model="smsDtl.route"></v-select>
                                            </v-flex>
                                            <v-flex sm1></v-flex>
                                        </v-layout>
                                    </v-flex>
                                    <v-flex xs12 sm4 v-if="smsDtl.route == 4">
                                        <v-layout row wrap>
                                            <v-flex xs12 sm11>
                                                <v-text-field v-model="smsDtl.sender" type=text maxlength="6" :rules="senderRules" label="Sender ID" ></v-text-field>
                                            </v-flex>
                                            <v-flex sm1></v-flex>
                                        </v-layout>
                                    </v-flex>
                                    <v-flex xs12 sm4>
                                        <v-layout row wrap>
                                            <v-flex xs12 sm11>
                                                <v-text-field v-model="smsDtl.apikey" :rules="requiredRules" label="Api Key" type=text></v-text-field>
                                            </v-flex>
                                            <v-flex sm1></v-flex>
                                        </v-layout>
                                    </v-flex>
                                </v-layout>
                            </div>
                        </v-expand-transition>
                    </v-card-text>
                </v-card>
                <v-layout justify-end align-center class="ma-2">
                    <v-btn color="info" type=submit round :loading="loading">
                        <v-icon dark small class="mr-1"> edit</v-icon>Save
                    </v-btn>            
                </v-layout>
            </v-form>
        </v-flex>
    </v-layout>
</template>
<script>
    export default {
        layout: "dashboard",
        created() {
            this.generate()
        },
        data() {
            return {
                expand1: true,
                expand2:true,
                expand3:true,
                sms:true,
                validPD:false,
                pdval:0,
                ctval:0,
                bdval:0,
                requiredRules: [
                    v => !!v || 'This Field is required'
                ],
                numberRules: [
                    v => !!v || 'This Field is required',
                    v => (v > 999999999 && v<= 9999999999) || 'Mobile No is of 10 Digits' 
                ],
                senderRules: [
                    v => !!v || 'This Field is required',
                    v => v.length == 6 || 'Sender Id is of 6 digits'
                ],
                smsDtl:{
                    route:4,
                    sender:"",
                    apikey:""
                },
                companyDtl: {
                    name: null,
                    mobile: null,
                    address: null,
                    state: null,
                    city: null,
                    statecode: null,
                    gstin: null,
                    tnc: null,
                    id: null,
                    billuppertext: null
                },
                showModal: false,
                bankDtl: {
                    accountno: null,
                    accountname: null,
                    name: null,
                    ifsc: null
                },
                credentials: {
                    oldPass: "",
                    newPass: "",
                    confPass: ""
                },
                requiredRules: [
                    v => !!v || 'This Field is required'
                ],
                loading:false
            }
        },
        methods: {
            checkPD(){
                let v = 0
                if(this.companyDtl.billuppertext != null && this.companyDtl.billuppertext != "" && 
                this.companyDtl.name != null && this.companyDtl.name != "" &&
                this.companyDtl.mobile != null && this.companyDtl.mobile != ""){
                    this.validPD = true
                }
                else this.validPD = false
                if(this.companyDtl.name != null && this.companyDtl.name != "") v++;
                if(this.companyDtl.mobile != null && this.companyDtl.mobile != "") v++;
                if(this.companyDtl.address != null && this.companyDtl.address != "") v++;
                if(this.companyDtl.state != null && this.companyDtl.state != "") v++;
                if(this.companyDtl.city != null && this.companyDtl.city != "") v++;
                if(this.companyDtl.statecode != null && this.companyDtl.statecode != "") v++;
                if(this.companyDtl.gstin != null && this.companyDtl.gstin != "") v++;
                if(this.companyDtl.billuppertext != null && this.companyDtl.billuppertext != "") v++;
                this.pdval = (100/8) * v 
            },
            checkBD(){
                let v = 0
                if(this.bankDtl.accountno != null && this.bankDtl.accountno != "") v++;
                if(this.bankDtl.accountname != null && this.bankDtl.accountname != "") v++;
                if(this.bankDtl.name != null && this.bankDtl.name != "") v++;
                if(this.bankDtl.ifsc != null && this.bankDtl.ifsc != "") v++;
                this.bdval = (100/4) * v 
            },
            checkCT(){
                let v = 0
                if(this.companyDtl.tnc != null && this.companyDtl.tnc != "") v++;
                this.ctval = (100/1) * v 
            },
            async generate() {
                await this.$axios.get("/" + this.$route.params.username + "/api/Details?access_token=" + this.$store.state.token)
                    .then(res => {
                        this.companyDtl.id = res.data[0].id;
                        this.companyDtl.name = res.data[0].name;
                        this.companyDtl.mobile = res.data[0].mobile;
                        this.companyDtl.billuppertext = res.data[0].billuppertext;
                        this.companyDtl.address = res.data[0].address;
                        this.companyDtl.state = res.data[0].state;
                        this.companyDtl.city = res.data[0].city;
                        this.companyDtl.statecode = res.data[0].statecode;
                        this.companyDtl.gstin = res.data[0].gstin;
                        this.companyDtl.tnc = res.data[0].termsandconditions;
                        this.bankDtl.accountno = res.data[0].bankaccountno;
                        this.bankDtl.accountname = res.data[0].bankaccountname;
                        this.bankDtl.name = res.data[0].bankname;
                        this.bankDtl.ifsc = res.data[0].bankifsc;
                        this.sms = res.data[0].sms
                        this.smsDtl.route = res.data[0].route
                        this.smsDtl.sender = res.data[0].senderid
                        this.smsDtl.apikey = res.data[0].apikey
                        this.checkPD()
                        this.checkBD()
                        this.checkCT()
                    });
            },
            async editDetail() {
                this.companyDtl.mobile = Number(this.companyDtl.mobile)
                if (this.$refs.form.validate()) {
                    this.loading = true
                    await this.$axios.post("/" + this.$route.params.username + "/api/Details/update?access_token=" + this.$store.state.token + "&where[id]=" + this.companyDtl.id,
                        {
                            name: this.companyDtl.name,
                            mobile: this.companyDtl.mobile,
                            address: this.companyDtl.address,
                            state: this.companyDtl.state,
                            city: this.companyDtl.city,
                            pincode: this.companyDtl.pincode,
                            statecode: this.companyDtl.statecode,
                            billuppertext: this.companyDtl.billuppertext,
                            logo: "aab",
                            gstin: this.companyDtl.gstin,
                            termsandconditions: this.companyDtl.tnc,
                            bankaccountno: this.bankDtl.accountno,
                            bankaccountname: this.bankDtl.accountname,
                            bankname: this.bankDtl.name,
                            bankifsc: this.bankDtl.ifsc,
                            sms: this.sms,
                            route:this.smsDtl.route,
                            senderid : this.smsDtl.sender,
                            apikey:this.smsDtl.apikey,
                            modifiedon: new Date(new Date().getTime() - (new Date().getTimezoneOffset() * 60000)).toISOString()
                        })
                        .then(res => {
                            this.loading = false
                            this.$store.commit("snackbar/setSnack", "Details Changed!");
                        });
                }
            }
        }
    }
</script>