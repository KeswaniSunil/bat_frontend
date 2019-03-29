<template>
  <v-layout>
    <v-flex xs12 sm12>
      <v-card class="border-radius-5"> 
          <v-card-text>
            <v-layout align-center justify-start row wrap>
            <v-flex xs6 sm10></v-flex>
            <v-flex xs6 sm2>
              
                  <v-btn color="info" round class="pa-2" @click="showModal = true,editValue=null">
                    <v-icon dark small class="mr-2"> gavel</v-icon>Add Supplier
                  </v-btn>
            </v-flex>
          </v-layout>

          <csListingComponent v-model="editValue" :modalAction="closeModal1" mode="supplier"/>
        
        <v-dialog width="800" v-model="showModal" persistent>
          <v-card>
            <v-card-title class="pt-2 pb-2" style="border-bottom:1px solid #A5A5A5;">
              <span style="font-size:18px;" v-if="editValue==null">Add Supplier</span>
              <span style="font-size:18px;" v-else>Edit Supplier</span>
            </v-card-title>
            <v-card-text class="pa-0">
              <v-container grid-list-xs>
                <csAddComponent v-if="showModal==true" v-model="closeModal1" mode="supplier" :id="editValue"></csAddComponent>
              </v-container>
            </v-card-text>

            <v-divider></v-divider>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="primary" flat @click="showModal = false,editValue=null">
                Close
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        </v-card-text>
      </v-card>
    </v-flex>
  </v-layout>    
</template>
<script>
  import csAddComponent from "~/components/csAddComponent";
  import csListingComponent from "~/components/csListingComponent";
  export default {
    components: {
      csAddComponent,
      csListingComponent
    },
    data() {
      return {
        addinBulk: 0,
        showModal: false,
        showBulk: false,
        editValue:null,
        closeModal1:1
      }

    },
    updated(){
        // closeModal = 2 means reload the datatable
        if(this.closeModal1 == 2)
        {
            this.showModal = false
        }
    },
    watch: {
      editValue: {
        handler(){
          this.closeModal1 = 0
          if(this.editValue != null) {
            this.showModal = true
          }
        }
      }
    },
    mounted() {
      
    },
    methods: {
      
      // editItem(item) {
      //   this.editedIndex = this.customerDtl.indexOf(item)
      //   this.editedItem = Object.assign({}, item)
      //   this.dialog = true
      // },
      

    //     _suppress(evt) { evt.stopPropagation(); evt.preventDefault(); },
    // 	_drop(evt) {
    // 		evt.stopPropagation(); evt.preventDefault();
    // 		const files = evt.dataTransfer.files;
    // 		if(files && files[0]) this._file(files[0]);
    // 	},
    // 	_change(evt) {
    // 		const files = evt.target.files;
    // 		if(files && files[0]) this._file(files[0]);
    // 	},
    // 	_file(file) {
    // 		/* Boilerplate to set up FileReader */
    // 		const reader = new FileReader();
    // 		reader.onload = (e) => {
    // 			/* Parse data */
    // 			const bstr = e.target.result;
    // 			const wb = XLSX.read(bstr, {type:'binary'});
    // 			/* Get first worksheet */
    // 			const wsname = wb.SheetNames[0];
    // 			const ws = wb.Sheets[wsname];
    // 			/* Convert array of arrays */
    // 			const data = XLSX.utils.sheet_to_json(ws, {header:1});
    //             //console.log(JSON.stringify(data))
    //             //var a=[]
    //             //var j=0;
    //             let promise = new Promise((resolve,reject)=>{
    //                 for(let i=1;i<data.length;i++)
    //                 {
    //                 // a[j]=new Object()

    //                     // console.log(JSON.stringify(data[i][j]));
    //                     // a[j].name = data[i][0];
    //                     // a[j].mobile=data[i][1];
    //                     // a[j].email=data[i][2];
    //                     // a[j].street=data[i][3];
    //                     // a[j].area=data[i][4];
    //                     // a[j].pincode=data[i][5];
    //                     // a[j].city=data[i][6];
    //                     // a[j].state=data[i][7];
    //                     // a[j].gstin=data[i][8];
    //                     // a[j].statecode=data[i][9];
    //                     // a[j].isenabled=1;
    //                     // a[j].createdon=new Date();
    //                     // a[j].modifiedon=new Date();
    //                     // a[j].createdById=1;
    //                     // a[j].modifiedById=1;
    //                     // a[j].customerTypeId="0131ef88-91a1-4b63-9a5a-d5a36cd0252";
    //                     // j++;
    //                     this.$axios.post("/"+this.$route.params.username+"/api/Customers?access_token="+this.$store.state.token,{
    //                         name:data[i][0],
    //                         mobile:data[i][1],
    //                         email:data[i][2],
    //                         street:data[i][3],
    //                         area:data[i][4],
    //                         pincode:data[i][5],
    //                         city:data[i][6],
    //                         state:data[i][7],
    //                         gstin:data[i][8],
    //                         statecode:data[i][9],
    //                         isenabled:1,
    //                         createdon:new Date(new Date().getTime() - (new Date().getTimezoneOffset() * 60000)).toISOString(),
    //                         modifiedon:new Date(new Date().getTime() - (new Date().getTimezoneOffset() * 60000)).toISOString(),
    //                         createdById:1,
    //                         modifiedById:1,
    //                         customerTypeId:'0131ef88-91a1-4b63-9a5a-d5a36cd0252'
    //                     })
    //                         .then(res => {
    //                             resolve("1");
    //                         },
    //                          (error) => { reject(i-1)});
    //                 }
    //             });
    //             promise.then((resolve)=>{
    //                 if(resolve=="1"){
    //                         //alert("All Clients Successfully Added")
    //                     //window.location="";
    //                     this.showBulk = false
    //                     this.generate()
    //                 }
    //             });
    //             promise.catch((rej)=>{
    //                 alert("Your Row number"+rej+" is not valid")
    //                 //window.location="";
    //                 this.showBulk = false
    //                 this.generate()
    //             });

    //             //console.log(b);


    // 			/* Update state */
    // 		};
    // 		reader.readAsBinaryString(file);
    // 	},
    //     async generate(){
    //            await this.$axios.get("/"+this.$route.params.username+"/api/Customers?access_token="+this.$store.state.token+"&filter[where][isenabled]=1")
    //                 .then(res => {
    //                     this.customerDtl=res.data;
    //                     this.selectCustomer = []
    //                 });
    //     },
    //     sendId(event)
    //     {
    //         this.checkAll=false;
    //         if(event.target.checked)
    //         {  
    //              this.enableDel=1;
    //         }
    //         else 
    //         {   
    //             if(this.selectCustomer.length==0){
    //                 this.enableDel=0;
    //             }
    //         }
    //         //console.log(this.selectCustomer);
    //         //console.log(this.selectCustomer.length)
    //     },
    //     allSelect() 
    //     {
    //         this.selectCustomer = [];
    //         this.enableDel=0;
    // 		if (this.checkAll) {
    //             this.enableDel=1
    // 			for (let i in this.customerDtl) {
    //                 this.selectCustomer.push(this.customerDtl[i].id);
    //                // console.log(this.selectCustomer[i]);
    // 			}
    //         }
    //        // console.log(this.selectCustomer)
    //     },
    //     async deleteCustomer()
    //     {
    //         if (confirm("Do you really want to delete?")) 
    //         {   
    //             let promise = new Promise((resolve,reject)=>{
    //                 for(let i=0;i<this.selectCustomer.length;i++)
    //                 {
    //                     //console.log(this.selectCustomer[i]);
    //                     this.$axios.post("/"+this.$route.params.username+"/api/Customers/update?access_token="+this.$store.state.token+"&where[id]="+this.selectCustomer[i],
    //                     {
    //                         isenabled:0
    //                     })
    //                     .then(res => {
    //                         //console.log("customer="+res.data);
    //                     this.$axios.post("/"+this.$route.params.username+"/api/Orders/update?access_token="+this.$store.state.token+"&where[customerId]="+this.selectCustomer[i],
    //                         {
    //                             isenabled:0
    //                         })
    //                             .then(res1 => {
    //                                 resolve("1");
    //                             });

    //                     });
    //                 }
    //             });    
    //             promise.then((resolve)=>{
    //                 if(resolve=="1"){
    //                     //alert("Successfully Deleted")
    //                     //window.location="";
    //                     this.generate()
    //                 }
    //             })
    //         }
    //         else{}

    //     },
  }
    //     viewAllDetail(val){
    //        // console.log("clicked"+val);
    //           this.$router.push("/"+this.$route.params.username+"/dashboard/sales/customer/"+val+"/viewAllDetails");
    //     },
    //     remEdit()
    //     {
    //         this.editValue=null;
    //     }


    // }
  }
</script>
<style>

</style>