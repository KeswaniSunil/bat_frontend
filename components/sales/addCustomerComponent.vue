<template>
                         <v-form @submit.prevent="add" ref="form1" lazy-validation onkeypress="return event.keyCode != 13">   
                            <v-layout align-center justify-start row wrap>
                                    <v-flex xs12 sm12>
                                        <v-layout align-center row wrap>
                                            <v-flex v-if="biggerScreen" xs12 sm2 class="text-lg-left">
                                                <label class="font-15 font-weight-regular">Customer Name: </label>
                                            </v-flex>
                                            <v-flex xs12 sm6>
                                                <v-layout align-center row wrap>
                                                    <v-flex xs1 sm1></v-flex>
                                                    <v-flex xs3 sm2>
                                                        <v-select
                                                            class="pa-0 ma-0"
                                                            :items="[{title:'',val:''},{title:'MR.',val:'MR.'},{title:'MRS.',val:'MRS.'},{title:'MS.',val:'MS.'},{title:'MISS.',val:'MISS.'}]"
                                                            item-text="title"
                                                            item-value="val"
                                                            v-model="customerDetails.ini"
                                                            :single-line="biggerScreen"
                                                        ></v-select>
                                                    </v-flex>
                                                    <v-flex xs1 sm1></v-flex>
                                                    <v-flex xs8 sm7>
                                                        <v-text-field
                                                            label="First Name"
                                                            class="pa-0 ma-0"
                                                            type=text
                                                            :rules="requiredRules"
                                                            :single-line="biggerScreen"
                                                            v-model="customerDetails.firstName"
                                                        ></v-text-field>
                                                    </v-flex>
                                                    <v-flex sm1></v-flex>       
                                                </v-layout>
                                            </v-flex>    
                                            <v-flex xs12 sm4>
                                                <v-text-field
                                                    label="Last Name"
                                                    :single-line="biggerScreen"
                                                    type=text
                                                    class="pa-0 ma-0"
                                                    :rules="requiredRules"
                                                    v-model="customerDetails.lastName"
                                                ></v-text-field>
                                            </v-flex>
                                        </v-layout>    
                                    </v-flex>    
                                    <v-flex sm12>
                                        <v-layout align-center row wrap>
                                            <v-flex v-if="biggerScreen" xs12 sm2 class="text-lg-left">
                                                <label class="font-15 font-weight-regular">Mobile No: </label>
                                            </v-flex>
                                            <v-flex xs12 sm4>
                                                <v-text-field
                                                    label=""
                                                    type=number
                                                    :single-line="biggerScreen"
                                                    :rules="requiredRules"
                                                    class="pa-0 ma-0"
                                                    v-model="customerDetails.mobile"
                                                ></v-text-field>
                                            </v-flex>
                                            <v-flex v-if="biggerScreen" xs12 sm2 class="text-lg-center">
                                                <label class="font-15 font-weight-regular">Email: </label>
                                            </v-flex>
                                            <v-flex xs12 sm4>
                                                <v-text-field
                                                    label=""
                                                    type=text
                                                    :single-line="biggerScreen"
                                                    class="pa-0 ma-0"
                                                    v-model="customerDetails.email"
                                                ></v-text-field>
                                            </v-flex>
                                        </v-layout>    
                                    </v-flex>   
                                    <v-flex sm12>
                                        <v-layout align-center row wrap>
                                            <v-flex v-if="biggerScreen" xs12 sm2 class="text-lg-left">
                                                <label class="font-15 font-weight-regular">Street: </label>
                                            </v-flex>
                                            <v-flex xs12 sm10>
                                                <v-textarea
                                                    solo
                                                    full-width
                                                    rows="3"
                                                    :single-line="biggerScreen"
                                                    class="pa-0 ma-0"
                                                    hint="Enter Street Address"
                                                    v-model="customerDetails.street"
                                                ></v-textarea>
                                            </v-flex>
                                        </v-layout>    
                                    </v-flex> 
                                    <v-flex sm12>
                                        <v-layout align-center row wrap>
                                            <v-flex v-if="biggerScreen" xs12 sm2 class="text-lg-left">
                                                <label class="font-15 font-weight-regular">Area: </label>
                                            </v-flex>
                                            <v-flex xs12 sm4>
                                                <v-text-field
                                                    label=""
                                                    type=text
                                                    :single-line="biggerScreen"
                                                    class="pa-0 ma-0"
                                                    v-model="customerDetails.area"
                                                ></v-text-field>
                                            </v-flex>
                                            <v-flex v-if="biggerScreen" xs12 sm2 class="text-lg-center">
                                                <label class="font-15 font-weight-regular">Pincode: </label>
                                            </v-flex>
                                            <v-flex xs12 sm4>
                                                <v-text-field
                                                    label=""
                                                    type=text
                                                    :single-line="biggerScreen"
                                                    class="pa-0 ma-0"
                                                    v-model="customerDetails.pinCode"
                                                ></v-text-field>
                                            </v-flex>
                                        </v-layout>    
                                    </v-flex> 
                                    <v-flex sm12>
                                        <v-layout align-center row wrap>
                                            <v-flex v-if="biggerScreen" xs12 sm2 class="text-lg-left">
                                                <label class="font-15 font-weight-regular">City: </label>
                                            </v-flex>
                                            <v-flex xs12 sm4>
                                                <v-text-field
                                                    label=""
                                                    type=text
                                                    :single-line="biggerScreen"
                                                    class="pa-0 ma-0"
                                                    v-model="customerDetails.city"
                                                ></v-text-field>
                                            </v-flex>
                                            <v-flex v-if="biggerScreen" xs12 sm2 class="text-lg-center">
                                                <label class="font-15 font-weight-regular">State: </label>
                                            </v-flex>
                                            <v-flex xs12 sm4>
                                                <v-text-field
                                                    label=""
                                                    type=text
                                                    :single-line="biggerScreen"
                                                    class="pa-0 ma-0"
                                                    v-model="customerDetails.state"
                                                ></v-text-field>
                                            </v-flex> 
                                        </v-layout>    
                                    </v-flex> 
                                    <v-flex sm12>
                                        <v-layout align-center row wrap>
                                                    <v-flex v-if="biggerScreen" xs12 sm2 class="text-lg-left">
                                                        <label class="font-15 font-weight-regular">State Code: </label>
                                                    </v-flex>
                                                    <v-flex xs12 sm4>
                                                        <v-text-field
                                                            label=""
                                                            type=text
                                                            :single-line="biggerScreen"
                                                            class="pa-0 ma-0"
                                                            v-model="customerDetails.stateCode"
                                                        ></v-text-field>
                                                    </v-flex>
                                                    <v-flex v-if="biggerScreen" xs12 sm2 class="text-lg-center">
                                                        <label class="font-15 font-weight-regular">Gstn: </label>
                                                    </v-flex>
                                                    <v-flex xs12 sm4>
                                                        <v-text-field
                                                            label=""
                                                            type=text
                                                            :single-line="biggerScreen"
                                                            class="pa-0 ma-0"
                                                            v-model="customerDetails.gstn"
                                                        ></v-text-field>
                                                    </v-flex>
                                        </v-layout>    
                                    </v-flex>  
                                    <v-flex sm12>
                                        <v-layout text-xs-right row wrap>
                                            <v-flex xs8 sm10></v-flex>
                                            <v-flex xs4 sm2>
                                                <v-btn v-if="propCheck==0" class="" :loading="btnLoading" type="submit" color="info" round dark @click="">
                                                    Add
                                                </v-btn>
                                                <v-btn v-else class="" :loading="btnLoading" type="submit" color="info" round dark @click="">
                                                    Save
                                                    <v-icon dark right class="ml-1">check_circle</v-icon>
                                                    
                                                </v-btn>
                                            </v-flex>
                                        </v-layout>
                                    </v-flex>          
                            </v-layout>
                        </v-form>    
                                     
</template>
<script>
export default {
    //layout : "dashboard_ly",
    props:{
        id:{
            type: String,
            required: false
        },
        value:{
            type: Number,
            required: false
        }
    },  
    created(){
        if(this.id != null)
        {
            this.propCheck=1
            this.fillData()
        }
    },
    data(){
        return{
           customerDetails:{
               ini:"",
               firstName:"",
               lastName:"",
               mobile:"",
               email:"",
               street:"",
               area:"",
               pinCode:null,
               city:"",
               state:"",
               gstn:"",
               stateCode:null
           },
           requiredRules: [
                v => !!v || 'This Field is required'
            ],
           biggerScreen:true,
           btnLoading:false,
           editCustomerDtl:[],
           propCheck:0
        }
    },
    methods:{
        async add()
        {   
            if (this.$refs.form1.validate())
            {    
                if(this.propCheck==0)
                {   
                    this.btnLoading=true
                    var aa=this.customerDetails.ini+" "+this.customerDetails.firstName+" "+this.customerDetails.lastName;
                    await this.$axios.post("/"+this.$route.params.username+"/api/Customers?access_token="+this.$store.state.token,{
                    name:aa,
                    mobile:this.customerDetails.mobile,
                    email:this.customerDetails.email,
                    gstin:this.customerDetails.gstn,
                    street:this.customerDetails.street,
                    area:this.customerDetails.area,
                    city:this.customerDetails.city,
                    state:this.customerDetails.state,
                    pincode:this.customerDetails.pinCode,
                    statecode:this.customerDetails.stateCode,
                    isenabled:1,
                    createdon: new Date(new Date().getTime() - (new Date().getTimezoneOffset() * 60000)).toISOString(),
                    modifiedon: new Date(new Date().getTime() - (new Date().getTimezoneOffset() * 60000)).toISOString(),
                    createdById:this.$store.state.userId,
                    modifiedById:this.$store.state.userId,
                    customerTypeId:"0131ef88-91a1-4b63-9a5a-d5a36cd0252"
                        
                    }
                    )
                    .then(res => {
                        if(res)
                        {
                                    //alert("Customer Succesfully Added")
                                    //window.location=""
                            this.btnLoading=false        
                            this.$emit('input', 2);
                        }
                    });
                }
                else{
                    this.btnLoading=true
                    var aa=this.customerDetails.ini+" "+this.customerDetails.firstName+" "+this.customerDetails.lastName;
                    await this.$axios.post("/"+this.$route.params.username+"/api/Customers/update?access_token="+this.$store.state.token+"&where[id]="+this.id,
                    {
                    name:aa,
                    mobile:this.customerDetails.mobile,
                    email:this.customerDetails.email,
                    gstin:this.customerDetails.gstn,
                    street:this.customerDetails.street,
                    area:this.customerDetails.area,
                    city:this.customerDetails.city,
                    state:this.customerDetails.state,
                    pincode:this.customerDetails.pinCode,
                    statecode:this.customerDetails.stateCode,
                    isenabled:1,
                    modifiedon: new Date(new Date().getTime() - (new Date().getTimezoneOffset() * 60000)).toISOString(),
                    modifiedById:this.$store.state.userId,
                    customerTypeId:"0131ef88-91a1-4b63-9a5a-d5a36cd0252"   
                    })
                        .then(res1 => {
                            if(res1){
                                    //alert("Customer Succesfully Edited and Saved")
                                    //window.location=""
                                    this.btnLoading=false
                                    this.$emit('input', 2);
                                }
                        });

                }
            }
        },
        async fillData(){
           await this.$axios.get("/"+this.$route.params.username+"/api/Customers/"+this.id+"?access_token="+this.$store.state.token)
                    .then(res => {
                       this.editCustomerDtl=res.data;   
                       var a=this.editCustomerDtl.name;
                        var aa=a.split(" ")
                        if(aa.length==3){
                            this.customerDetails.ini=aa[0];
                            this.customerDetails.firstName=aa[1];
                            this.customerDetails.lastName=aa[2];
                        }
                        else{
                            this.customerDetails.firstName=aa[0];
                            this.customerDetails.lastName=aa[1];
                        }
                        this.customerDetails.mobile=this.editCustomerDtl.mobile;
                        this.customerDetails.email=this.editCustomerDtl.email;
                        this.customerDetails.street=this.editCustomerDtl.street;
                        this.customerDetails.area=this.editCustomerDtl.area;                       
                        this.customerDetails.pinCode=this.editCustomerDtl.pincode;
                        this.customerDetails.city=this.editCustomerDtl.city;
                        this.customerDetails.state=this.editCustomerDtl.state;
                        this.customerDetails.gstn=this.editCustomerDtl.gstin;
                        this.customerDetails.stateCode=this.editCustomerDtl.statecode;    
                    });
                    
                       
                           
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

