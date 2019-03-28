<template>
    <v-layout row wrap>
        <v-flex xs12 sm12 >
            
            <v-layout align-center justify-start row wrap>
                <v-flex xs12 sm12 class="pa-3">
                    <span style="font-size:25px;">Company Details</span>
                </v-flex>
            </v-layout>  
            <v-card class="border-radius-5 mr-3 mb-3 ml-3" > 
                <v-card-text>
                    <v-layout justify-start row wrap class="mb-1">
                        <v-flex xs5 sm10></v-flex>
                        <v-flex xs7 sm2>
                            <v-btn color="info" class="pa-1" @click="showModal=true">
                                <v-icon dark small > edit</v-icon>Change Password
                            </v-btn>    
                        </v-flex>    
                    </v-layout>
                    <v-form @submit.prevent="editDetail" onkeypress="return event.keyCode != 13">
                        <v-layout row wrap class="mb-4">
                            <v-flex xs12 sm12>
                                <div class="font-18 myborder-bottom">Personal Details:-</div>
                            </v-flex>    
                        </v-layout>
                        <v-layout justify-start row wrap class="mb-3"></v-layout>
                        <v-layout row wrap class="mb-1">
                            <v-flex xs12 sm4>
                                <v-layout row wrap>
                                    <v-flex xs12 sm11>
                                        <label class="font-16 font-weight-regular">Customer Name </label>
                                        <v-text-field
                                        class="pa-0 ma-0"
                                        type=text
                                        label=""
                                        height=22
                                        v-model="companyDtl.name"
                                        ></v-text-field>
                                    </v-flex>
                                    <v-flex sm1></v-flex>
                                </v-layout>    
                            </v-flex>
                            <v-flex xs12 sm4>
                                <v-layout row wrap>
                                    <v-flex xs12 sm11>
                                        <label class="font-16 font-weight-regular">Mobile No.</label>
                                        <v-text-field
                                        class="pa-0 ma-0"
                                        v-model="companyDtl.mobile"
                                        type=number
                                        label=""
                                        height=22
                                        ></v-text-field>
                                    </v-flex>
                                    <v-flex sm1></v-flex>
                                </v-layout>    
                            </v-flex>
                            <v-flex xs12 sm4>
                                <v-layout row wrap>
                                    <v-flex xs12 sm11>
                                        <label class="font-16 font-weight-regular">Bill Upper Text </label>
                                        <v-text-field
                                        class="pa-0 ma-0"
                                        v-model="companyDtl.billuppertext"
                                        label=""
                                        type=text
                                        height=22
                                        ></v-text-field>
                                    </v-flex>
                                    <v-flex sm1></v-flex>
                                </v-layout>    
                            </v-flex>
                        </v-layout> 
                        <v-layout row wrap class="mb-1">
                            <v-flex xs12 sm7>
                                <label class="font-16 font-weight-regular">Address</label>
                                <v-textarea
                                    outline
                                    rows="3"
                                    class="pa-0 ma-0"
                                    full-width
                                    hint="Street Address"
                                    v-model="companyDtl.address"
                                ></v-textarea>
                            </v-flex>
                            <v-flex sm5></v-flex>
                        </v-layout>           
                        <v-layout row wrap class="mb-5">
                            <v-flex xs12 sm3>
                                <v-layout row wrap>
                                    <v-flex xs12 sm11>
                                        <label class="font-16 font-weight-regular">State  </label>
                                        <v-text-field
                                        class="pa-0 ma-0"
                                        label=""
                                        type=text
                                        height=22
                                        v-model="companyDtl.state"
                                        ></v-text-field>
                                    </v-flex>
                                    <v-flex sm1></v-flex>
                                </v-layout>    
                            </v-flex>
                            <v-flex xs12 sm3>
                                <v-layout row wrap>
                                    <v-flex xs12 sm11>
                                        <label class="font-16 font-weight-regular">City  </label>
                                        <v-text-field
                                        class="pa-0 ma-0"
                                        label=""
                                        type=text
                                        height=22
                                        v-model="companyDtl.city"
                                        ></v-text-field>
                                    </v-flex>
                                    <v-flex sm1></v-flex>
                                </v-layout>    
                            </v-flex>
                            <v-flex xs12 sm3>
                                <v-layout row wrap>
                                    <v-flex xs12 sm11>
                                        <label class="font-16 font-weight-regular">State Code  </label>
                                        <v-text-field
                                        class="pa-0 ma-0"
                                        label=""
                                        type=number
                                        height=22
                                        v-model="companyDtl.statecode"
                                        ></v-text-field>
                                    </v-flex>
                                    <v-flex sm1></v-flex>
                                </v-layout>    
                            </v-flex>
                            <v-flex xs12 sm3>
                                <v-layout row wrap>
                                    <v-flex xs12 sm11>
                                        <label class="font-16 font-weight-regular">GSTN </label>
                                        <v-text-field
                                        class="pa-0 ma-0"
                                        type=text
                                        label=""
                                        height=22
                                        v-model="companyDtl.gstin"
                                        ></v-text-field>
                                    </v-flex>
                                    <v-flex sm1></v-flex>
                                </v-layout>    
                            </v-flex>
                        </v-layout>
                        <v-layout row wrap class="mb-4">
                            <v-flex xs12 sm12>
                                <div class="font-18 myborder-bottom">Bank Details:-</div>
                            </v-flex>    
                        </v-layout>
                        <v-layout class="mb-3"></v-layout>
                        <v-layout row wrap class="mb-4">
                            <v-flex xs12 sm3>
                                <v-layout row wrap>
                                    <v-flex xs12 sm11>
                                        <label class="font-16 font-weight-regular">Bank Account No.  </label>
                                        <v-text-field
                                        class="pa-0 ma-0"
                                        label=""
                                        type=text
                                        height=22
                                        v-model="bankDtl.accountno"
                                        ></v-text-field>
                                    </v-flex>
                                    <v-flex sm1></v-flex>
                                </v-layout>    
                            </v-flex>
                            <v-flex xs12 sm3>
                                <v-layout row wrap>
                                    <v-flex xs12 sm11>
                                        <label class="font-16 font-weight-regular">Bank Account Name</label>
                                        <v-text-field
                                        class="pa-0 ma-0"
                                        label=""
                                        height=22
                                        type=text
                                        v-model="bankDtl.accountname"
                                        ></v-text-field>
                                    </v-flex>
                                    <v-flex sm1></v-flex>
                                </v-layout>    
                            </v-flex>
                            <v-flex xs12 sm3>
                                <v-layout row wrap>
                                    <v-flex xs12 sm11>
                                        <label class="font-16 font-weight-regular">Bank Name  </label>
                                        <v-text-field
                                        class="pa-0 ma-0"
                                        label=""
                                        height=22
                                        type=text
                                        v-model="bankDtl.name"
                                        ></v-text-field>
                                    </v-flex>
                                    <v-flex sm1></v-flex>
                                </v-layout>    
                            </v-flex>
                            <v-flex xs12 sm3>
                                <v-layout row wrap>
                                    <v-flex xs12 sm11>
                                        <label class="font-16 font-weight-regular">Bank IFSC</label>
                                        <v-text-field
                                        class="pa-0 ma-0"
                                        label=""
                                        height=22
                                        v-model="bankDtl.ifsc"
                                        type=text
                                        ></v-text-field>
                                    </v-flex>
                                    <v-flex sm1></v-flex>
                                </v-layout>    
                            </v-flex>
                        </v-layout>
                        <v-layout row wrap class="mb-4">
                            <v-flex xs12 sm12>
                                <div class="font-18 myborder-bottom">Company Terms:-</div>
                            </v-flex>    
                        </v-layout>
                        <v-layout row wrap class="mb-2"></v-layout>
                        <v-layout row wrap class="mb-1">
                            <v-flex xs12 sm7>
                                <label class="font-16 font-weight-regular">Terms and Conditions</label>
                                <v-textarea
                                    outline
                                    rows="3"
                                    full-width
                                    class="pa-0 mt-0"
                                    hint="Company T&C"
                                    v-model="companyDtl.tnc"
                                ></v-textarea>
                            </v-flex> 
                            <v-flex sm5></v-flex>   
                        </v-layout>
                        <v-layout row wrap class="mb-2">
                            <v-flex xs8 sm10 ></v-flex>
                            <v-flex xs4 sm2>
                                <v-layout row wrap >
                                    <v-flex sm5></v-flex>
                                    <v-flex sm7><v-btn color="info" type=submit >
                                    <v-icon dark small class="mr-1"> edit</v-icon>Save
                                </v-btn> </v-flex>
                                </v-layout>       
                            </v-flex>
                        </v-layout>    
                    </v-form>
                </v-card-text>
            </v-card>          
            
            <v-dialog width="400" v-model="showModal" >
          <v-card>
            <v-card-title class="pt-2 pb-2" style="border-bottom:1px solid #A5A5A5;">
              <span style="font-size:18px;">Change Password</span>
            </v-card-title>
            <v-card-text class="pa-0">
              <v-form @submit.prevent="changePass" ref="form1" lazy-validation onkeypress="return event.keyCode != 13">
                <v-container grid-list-xs class="pa-4">
                    <v-layout align-center justify-start row wrap class="mb-3">
                        <v-flex xs12 sm12>
                            <label class="font-16 font-weight-regular">Old Password </label>
                                <v-text-field
                                    class="pa-0 ma-0"
                                    label=""
                                    height=22
                                    type=text
                                    v-model="credentials.oldPass"
                                    :rules="requiredRules"
                                ></v-text-field>
                        </v-flex>    
                    </v-layout>
                    <v-layout align-center justify-start row wrap class="mb-3">
                        <v-flex xs12 sm12>
                            <label class="font-16 font-weight-regular">New Password  </label>
                                <v-text-field
                                    class="pa-0 ma-0"
                                    label=""
                                    height=22
                                    type=text
                                    v-model="credentials.newPass"
                                    :rules="requiredRules"
                                ></v-text-field>
                        </v-flex>    
                    </v-layout>
                    <v-layout align-center justify-start row wrap class="mb-2">
                        <v-flex xs12 sm12>
                            <label class="font-16 font-weight-regular">Confirm Password  </label>
                                <v-text-field
                                    class="pa-0 ma-0"
                                    label=""
                                    height=22
                                    type=text
                                    v-model="credentials.confPass"
                                    :rules="requiredRules"
                                ></v-text-field>
                        </v-flex>    
                    </v-layout>  
                    <v-layout align-center justify-start row wrap>
                        <v-flex xs7 sm8></v-flex>
                        <v-flex xs5 sm4>
                            <v-btn color="info" type=submit>
                                <v-icon dark small class="mr-1"> edit</v-icon>Change
                            </v-btn>
                        </v-flex>
                    </v-layout>       
                </v-container>
              </v-form>
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
        </v-flex>
            </v-layout>        
        </template>
        <script>
        export default {
        layout:"default",
created(){
    this.$store.state.token = '5FIQwvmvvuUCeQqfSqT1xCmGf7GdvJe4SUTPTUQ5Q2om9vxss8CadPNHCeVjP23L'
      this.$store.state.userId = 1
    this.generate()
},
data(){
    return{
        companyDtl:{
            name:null,
            mobile:null,
            address:null,
            state:null,
            city:null,
            statecode:null,
            gstin:null,
            tnc:null,
            id:null,
            billuppertext:null
        },
        showModal:false,
        bankDtl:{
            accountno:null,
            accountname:null,
            name:null,
            ifsc:null
       },
       credentials:{
           oldPass:"",
           newPass:"",
           confPass:""
       },
       requiredRules: [
                    v => !!v || 'This Field is required'
        ],
    }
},
methods:{
    async generate(){
        await this.$axios.get("/"+this.$route.params.username+"/api/Details?access_token="+this.$store.state.token)
			.then(res=>{
                this.companyDtl.id=res.data[0].id;
                this.companyDtl.name=res.data[0].name;
                this.companyDtl.mobile=res.data[0].mobile;
                this.companyDtl.billuppertext=res.data[0].billuppertext;
                this.companyDtl.address=res.data[0].address;
                this.companyDtl.state=res.data[0].state;
                this.companyDtl.city=res.data[0].city;
                this.companyDtl.statecode=res.data[0].statecode;
                this.companyDtl.gstin=res.data[0].gstin;
                this.companyDtl.tnc=res.data[0].termsandconditions;
                this.bankDtl.accountno=res.data[0].bankaccountno;
                this.bankDtl.accountname=res.data[0].bankaccountname;
                this.bankDtl.name=res.data[0].bankname;
                this.bankDtl.ifsc=res.data[0].bankifsc;
            });
    },
    async editDetail(){
        await this.$axios.post("/"+this.$route.params.username+"/api/Details/update?access_token="+this.$store.state.token+"&where[id]="+this.companyDtl.id,
			{
				name:this.companyDtl.name,
				mobile:this.companyDtl.mobile,
				address:this.companyDtl.address,
				state:this.companyDtl.state,
				city:this.companyDtl.city,
				pincode:this.companyDtl.pincode,
                statecode:this.companyDtl.statecode,
                billuppertext:this.companyDtl.billuppertext,
                logo:"aab",
                gstin:this.companyDtl.gstin,
                termsandconditions:this.companyDtl.tnc,
                bankaccountno:this.bankDtl.accountno,
                bankaccountname:this.bankDtl.accountname,
                bankname:this.bankDtl.name,
                bankifsc:this.bankDtl.ifsc,
                createdon:new Date(new Date().getTime() - (new Date().getTimezoneOffset() * 60000)).toISOString(),
                modifiedon:new Date(new Date().getTime() - (new Date().getTimezoneOffset() * 60000)).toISOString()


			})
			.then(res=>{
                alert("Details Edited and Saved")
            });
    },
    async changePass(){
        if (this.$refs.form1.validate())
        {    if(this.credentials.newPass==this.credentials.confPass){
                this.$axios.post("/"+this.$route.params.username+"/api/Users/change-password?access_token="+this.$store.state.token,{
                    oldPassword:this.credentials.oldPass,
                    newPassword:this.credentials.confPass
                }).then(res=>{
                    alert("Password Changed Successfully")
                    window.location=""
                })
            }
            else{
                alert("New password and confirm Password should be same")
            }
        }
    }
}
}
</script>
