<template>
  <v-layout>
    <v-flex xs12 sm12>
      <v-card>
        <v-container grid-list-xs>
          <v-layout align-center justify-start row wrap>
            <v-flex sm9></v-flex>
            <v-flex sm3>
              <v-btn color="info" round class="pa-2" @click="showModal = true,editValue=null">
                <v-icon dark small class="mr-2"> gavel</v-icon>Add Customer
              </v-btn>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card>
      <v-card>
        <v-card-title>
          <v-btn v-if="selectCustomer.length > 0" color="error" round class="pa-0" @click="deleteCustomer">
            <v-icon dark small class="mr-1">gavel</v-icon> Delete
          </v-btn>
          <v-spacer></v-spacer>
          <v-spacer></v-spacer>

          <v-spacer></v-spacer>
          <v-text-field v-model="search" append-icon="search" label="Search" single-line hide-details></v-text-field>
        </v-card-title>
        <v-data-table v-model="selectCustomer" :headers="header" :items="customerDtl" :pagination.sync="pagination"
          :total-items="totalCustomer" :loading="loading" select-all item-key="id" class="elevation-1">
          <template v-slot:no-data>
            <v-alert :value="true" color="error" icon="warning">
              Sorry, nothing to display here :(
            </v-alert>
          </template>
          <template v-slot:items="props">
            <td>
                <v-checkbox :input-value="props.selected" primary hide-details></v-checkbox>
              </td>
              <td>{{props.index+1}}</td>
              <td>{{ props.item.name }}</td>
              <td>{{ props.item.mobile }}</td>
              <td>{{ props.item.totalamount }}</td>
              <td>{{ props.item.received }}</td>
              <td> {{parseFloat(props.item.totalamount) - parseFloat(props.item.received)}} </td>
              <td>
                <v-icon small class="mr-12" @click="editCustomer(props.item.id)">edit
                </v-icon>
              </td>
          </template>
          <v-alert v-slot:no-results :value="true" color="error" icon="warning">
            Your search for "{{ search }}" found no results.
          </v-alert>
        </v-data-table>
        
        <v-dialog width="800" v-model="showModal" >
          <v-card>
            <v-card-title class="pt-2 pb-2" style="border-bottom:1px solid #A5A5A5;">
              <span style="font-size:18px;" v-if="editValue==null">Add Customer</span>
              <span style="font-size:18px;" v-else>Edit Customer</span>
            </v-card-title>
            <v-card-text class="pa-0">
              <v-container grid-list-xs>
                <addCustomer v-if="showModal==true" v-model="closeModal1" :id="editValue"></addCustomer>
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
      </v-card>
    </v-flex>
  </v-layout>    
</template>
<script>
  import addCustomer from "~/components/sales/addCustomerComponent";
  export default {
    components: {
      addCustomer
    },
    data() {
      return {
        header: [{
          text: '#',
          align: 'left',
          sortable: false,
          value: 'ind'
        },
        { text: 'Name', value: 'name', sortable: false },
        { text: 'Mobile', value: 'Mobile' },
        { text: 'Total Amount', value: 'totalamount' },
        { text: 'Total Recieved', value: 'totalrecieved' },
        { text: 'Total Recievables', value: 'totalrecievable' },
        { text: 'Edit', value: 'edit' }],
        loading: true,
        pagination: {},
        url: process.env.URL,
        customerDtl: [],
        selectCustomer: [],
        search: '',
        addinBulk: 0,
        showModal: false,
        showBulk: false,
        totalCustomer: 0,
        editValue:null,
        closeModal1:1
      }

    },
    updated(){
        
        if(this.closeModal1 == 2)
        {
            this.showModal = false
            this.getDataFromApi()
                .then(data => {
                  this.customerDtl = data.items
                  this.totalCustomer = data.total
            })
        }
    },
    watch: {
      pagination: {
        handler() {
          this.getDataFromApi()
            .then(data => {
              this.customerDtl = data.items
              this.totalCustomer = data.total
            })
        },
        deep: true
      }
    },
    mounted() {
      this.getDataFromApi()
        .then(data => {
          this.customerDtl = data.items
          this.totalCustomer = data.total
        })
    },
    methods: {
      toggleAll() {
        if (this.selectCustomer.length) this.selectCustomer = []
        else this.selectCustomer = this.customerDtl.slice()
      },
      changeSort(column) {
        if (this.pagination.sortBy === column) {
          this.pagination.descending = !this.pagination.descending
        } else {
          this.pagination.sortBy = column
          this.pagination.descending = false
        }
      },
      async deleteCustomer() {
        if (confirm("Do you really want to delete?")) {
          let promise = new Promise((resolve, reject) => {
            for (let i = 0; i < this.selectCustomer.length; i++) {
              //console.log(this.selectCustomer[i]);
              this.$axios.post("/" + this.$route.params.username + "/api/Customers/update?access_token=HIaSTRQmKsfb3ysIF3Bg84P7hzRxaCXdPg2q06Rk5B1yKlQ5E4LKOK5wiwgUEDBY&where[id]=" + this.selectCustomer[i].id,
                {
                  isenabled: 0
                })
                .then(res => {
                  //console.log("customer="+res.data);
                  this.$axios.post("/" + this.$route.params.username + "/api/Orders/update?access_token=HIaSTRQmKsfb3ysIF3Bg84P7hzRxaCXdPg2q06Rk5B1yKlQ5E4LKOK5wiwgUEDBY&where[customerId]=" + this.selectCustomer[i].id,
                    {
                      isenabled: 0
                    })
                    .then(res1 => {
                      resolve("1");
                    });

                });
            }
          });
          promise.then((resolve) => {
            if (resolve == "1") {
              //alert("Successfully Deleted")
              //window.location="";
              this.getDataFromApi()
                .then(data => {
                  this.customerDtl = data.items
                  this.totalCustomer = data.total
                })
            }
          })
        }
        else { }

      },
      // editItem(item) {
      //   this.editedIndex = this.customerDtl.indexOf(item)
      //   this.editedItem = Object.assign({}, item)
      //   this.dialog = true
      // },
      getDataFromApi() {
        this.loading = true
        return new Promise((resolve, reject) => {
          const { sortBy, descending, page, rowsPerPage } = this.pagination
          //console.log("aa")
          let items = "";
          this.$axios.get("/jay/api/Customers?access_token=AMHo9vQVi854r3gPjzYFUAnFwohRRX8x2uzR3V2mJDJ5JUfXMmfmDNoO5c17EXFx&filter[where][isenabled]=1")
            .then(res => {
              //console.log("bb")
              items = res.data;
              //console.log("cc")
              const total = items.length

              if (this.pagination.sortBy) {
                items = items.sort((a, b) => {
                  const sortA = a[sortBy]
                  const sortB = b[sortBy]

                  if (descending) {
                    if (sortA < sortB) return 1
                    if (sortA > sortB) return -1
                    return 0
                  } else {
                    if (sortA < sortB) return -1
                    if (sortA > sortB) return 1
                    return 0
                  }
                })
              }

              if (rowsPerPage > 0) {
                items = items.slice((page - 1) * rowsPerPage, page * rowsPerPage)
              }

              this.loading = false
              resolve({
                items,
                total
              })
              //console.log(res.data)
            });
        })
      },
      generate() {
        this.$axios.get("/jay/api/Customers?access_token=AMHo9vQVi854r3gPjzYFUAnFwohRRX8x2uzR3V2mJDJ5JUfXMmfmDNoO5c17EXFx&filter[where][isenabled]=1")
          .then(res => {
            //console.log("bb")
            return res.data;

            //console.log(res.data)
          });
      },

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
        editCustomer(val){
            this.editValue = "";
              if(this.editValue =="")
              {
                  this.editValue =val
                  this.showModal = true
                  //console.log(this.editValue)
              }
              //console.log(this.editValue)
        },
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