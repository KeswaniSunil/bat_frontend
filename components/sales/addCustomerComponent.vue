<template>
    <div class="container">
      <!-- begin breadcrumb -->
        <div class="row">
        <div class="col-sm-12">
            <form @submit.prevent="add" class="myforms">
              <div class="form-inline row m-b-15">
                  <div class="form-group col-sm-3 m-b-15 row">
                    <label>Customer Name*</label>
                    
                  </div>
                  <div class="form-group col-sm-5 m-b-15 row">
                      <select class="form-control col-3 col-sm-3" v-model="customerDetails.ini"     placeholder="Mr">
                        <option value="Mr.">Mr.</option>
                        <option value="Mrs.">Mrs.</option>
                        <option value="Ms.">Ms.</option>
                        <option value="Miss.">Miss.</option>
                    </select>
                    <div class="col-0.5 col-sm-0.5"></div>
                      <input type="text" class="form-control col-8 col-sm-8" required placeholder="Enter FirstName" v-model="customerDetails.firstName">
                  </div>     
                  <div class="form-group col-sm-3 row m-b-15">
                    <input type="text" class="form-control" required placeholder="Enter LastName" v-model="customerDetails.lastName">  
                  </div>
                  <div class="col-sm-1"></div>
              </div>
              <div class="form-inline row m-b-15">
                  <div class="form-group m-b-15 col-sm-5 row">
                      <label class="col-sm-5">Mobile No.*</label>
                      <input type="number" min="1000000000" max="99999999999" class="form-control col-sm-7" required placeholder="1234567890" v-model.number="customerDetails.mobile">
                  </div>
                  <div class="form-group col-sm-5 m-b-15 row">
                      <label class="col-sm-3">Email</label>
                      <input type="email" class="form-control col-sm-9" placeholder="eg: abc@gmail.com" v-model="customerDetails.email">
                  </div>
                  <div class="col-sm-2">
                  </div>
              </div>
              <div class="form-inline row m-b-25">
                  <div class="form-group col-sm-11 row">
                      <label class="col-sm-2">Street</label>
                    <textarea class="form-control col-sm-10" rows="4" v-model="customerDetails.street"></textarea>
                  </div>
                  <div class="col-sm-1"></div>    
              </div>
              <div class="form-inline row m-b-25">
                  <div class="form-group m-b-15 col-sm-4 row">
                       <label class="col-sm-4">Area</label>
                       <input type="text" class="form-control col-sm-8" placeholder="Enter Area" v-model="customerDetails.area">
                  </div>
                  <div class="form-group m-b-15 col-sm-4 row">
                       <label class="col-sm-4">Pincode</label>
                       <input type="number" class="form-control col-sm-8" placeholder="1234" v-model.number="customerDetails.pinCode">
                  </div>
                  <div class="form-group m-b-15 col-sm-4 row">
                       <label class="col-sm-3">city</label>
                    <input type="text" class="form-control col-sm-9" placeholder="Enter city" v-model="customerDetails.city">
                  </div>    
              </div>
              <div class="form-inline row m-b-25">
                  <div class="form-group m-b-15 col-sm-4 row">
                       <label class="col-sm-4">State</label>
                       <input type="text" class="form-control col-sm-8" placeholder="Enter State" v-model="customerDetails.state">
                  </div>
                  <div class="form-group m-b-15 col-sm-4 row">
                      <label class="col-sm-5">StateCode</label>
                      <input type="number" class="form-control col-sm-7"  v-model.number="customerDetails.stateCode">
                  </div>
                  <div class="form-group m-b-15 col-sm-4 row">
                       <label class="col-sm-3">Gstn</label>
                       <input type="text" class="form-control col-sm-9" placeholder="Enter Gstn" v-model.number="customerDetails.gstn">
                  </div>    
              </div> 
             <div class="row">
                              <div class="col-sm-10"></div>
                              <div class="col-sm-2">
                                <button type="submit" v-if="this.propCheck==0" class="btn btn-circle button-green right-float" ><i class="fa fa-bolt"></i> Add Customer</button>
                                <button type="submit" v-else class="btn btn-circle button-green right-float"><i class="fa fa-bolt"></i> Save</button>
                              </div> 
              </div>
          </form>    
        </div>     
       </div>    
  </div>
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
            //this.fillData()
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
           //editCustomerDtl:[],
           propCheck:0
        }
    },
    methods:{
        // async add()
        // {   
        //     if(this.propCheck==0)
        //     {   
        //         var aa=this.customerDetails.ini+" "+this.customerDetails.firstName+" "+this.customerDetails.lastName;
        //         await this.$axios.post("/"+this.$route.params.username+"/api/Customers?access_token="+this.$store.state.token,{
        //         name:aa,
        //         mobile:this.customerDetails.mobile,
        //         email:this.customerDetails.email,
        //         gstin:this.customerDetails.gstn,
        //         street:this.customerDetails.street,
        //         area:this.customerDetails.area,
        //         city:this.customerDetails.city,
        //         state:this.customerDetails.state,
        //         pincode:this.customerDetails.pinCode,
        //         statecode:this.customerDetails.stateCode,
        //         isenabled:1,
        //         createdon: new Date(new Date().getTime() - (new Date().getTimezoneOffset() * 60000)).toISOString(),
        //         modifiedon: new Date(new Date().getTime() - (new Date().getTimezoneOffset() * 60000)).toISOString(),
        //         createdById:this.$store.state.userId,
        //         modifiedById:this.$store.state.userId,
        //         customerTypeId:"0131ef88-91a1-4b63-9a5a-d5a36cd0252"
                    
        //         }
        //         )
        //         .then(res => {
        //             if(res)
        //             {
        //                         //alert("Customer Succesfully Added")
        //                         //window.location=""
        //                 this.$emit('input', 2);
        //             }
        //         });
        //     }
        //     else{
        //         var aa=this.customerDetails.ini+" "+this.customerDetails.firstName+" "+this.customerDetails.lastName;
        //         await this.$axios.post("/"+this.$route.params.username+"/api/Customers/update?access_token="+this.$store.state.token+"&where[id]="+this.id,
        //         {
        //          name:aa,
        //         mobile:this.customerDetails.mobile,
        //         email:this.customerDetails.email,
        //         gstin:this.customerDetails.gstn,
        //         street:this.customerDetails.street,
        //         area:this.customerDetails.area,
        //         city:this.customerDetails.city,
        //         state:this.customerDetails.state,
        //         pincode:this.customerDetails.pinCode,
        //         statecode:this.customerDetails.stateCode,
        //         isenabled:1,
        //         modifiedon: new Date(new Date().getTime() - (new Date().getTimezoneOffset() * 60000)).toISOString(),
        //         modifiedById:this.$store.state.userId,
        //         customerTypeId:"0131ef88-91a1-4b63-9a5a-d5a36cd0252"   
        //         })
        //             .then(res1 => {
        //                 if(res1){
        //                         //alert("Customer Succesfully Edited and Saved")
        //                         //window.location=""
        //                         this.$emit('input', 2);
        //                     }
        //             });

        //     }
        // },
        // async fillData(){
        //    await this.$axios.get("/"+this.$route.params.username+"/api/Customers/"+this.id+"?access_token="+this.$store.state.token)
        //             .then(res => {
        //                this.editCustomerDtl=res.data;   
        //                var a=this.editCustomerDtl.name;
        //                 var aa=a.split(" ")
        //                 if(aa.length==3){
        //                     this.customerDetails.ini=aa[0];
        //                     this.customerDetails.firstName=aa[1];
        //                     this.customerDetails.lastName=aa[2];
        //                 }
        //                 else{
        //                     this.customerDetails.firstName=aa[0];
        //                     this.customerDetails.lastName=aa[1];
        //                 }
        //                 this.customerDetails.mobile=this.editCustomerDtl.mobile;
        //                 this.customerDetails.email=this.editCustomerDtl.email;
        //                 this.customerDetails.street=this.editCustomerDtl.street;
        //                 this.customerDetails.area=this.editCustomerDtl.area;                       
        //                 this.customerDetails.pinCode=this.editCustomerDtl.pincode;
        //                 this.customerDetails.city=this.editCustomerDtl.city;
        //                 this.customerDetails.state=this.editCustomerDtl.state;
        //                 this.customerDetails.gstn=this.editCustomerDtl.gstin;
        //                 this.customerDetails.stateCode=this.editCustomerDtl.statecode;    
        //             });
                    
                       
                           
        // },
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

