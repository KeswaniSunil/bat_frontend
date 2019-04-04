<template>
    <div>
        <v-layout column class="pb-2">
            <v-flex sm12>
              <v-layout align-center row wrap>
                <v-flex xs3 sm1>
                  <v-btn v-if="selectCustomer.length > 0" color="error" round class="pa-0" @click="deleteCustomer">
                    <v-icon dark small class="mr-1">gavel</v-icon> Delete
                  </v-btn>
                </v-flex>
                <v-flex xs9 sm11></v-flex>
              </v-layout>
            </v-flex>
          </v-layout>    
                    <v-card class="elevation-5" style="border-radius:5px;">
                        <v-card-title v-if="mode=='customer'" class="pa-2 primary white--text">
                            List of All Customers:-
                        </v-card-title>
                        <v-card-title v-else class="pa-2 primary white--text">
                            List of All Suppliers:-
                        </v-card-title>
                        <v-card-text>
                            <v-layout row wrap >
                                <v-flex xs12 sm9 class="mb-3">
                                    <v-layout align-start justify-start row wrap>
                                        
                                        <v-btn color="primary" round class="pa-0 mr-1" :loading="loadingPDF" @click="_export('pdf')">
                                        <v-icon dark small class="mr-2"  reverse>cloud_download</v-icon>Pdf
                                    </v-btn>
                                    <v-btn color="primary" round  class="pa-0 " :loading="loadingExcel" @click="_export('excel')">
                                                <v-icon dark small class="mr-2"  reverse>cloud_download</v-icon>Excel   
                                            </v-btn>
                                            
                                    </v-layout>    
                                </v-flex>
                                <v-flex xs12 sm3 class="mb-3">
                                    <v-text-field v-model="search" append-icon="search" label="Search" class="pa-0 ma-0" single-line hide-details></v-text-field>
                                </v-flex>
                            
                            </v-layout>
        <v-data-table v-model="selectCustomer" :headers="header" :items="customerDtl" :pagination.sync="pagination"
          :total-items="totalCustomer" :loading="loading" select-all item-key="id" class="elevation-0">
          <template v-slot:headers="props">
            <tr>
              <th>
                <v-checkbox
                  :input-value="props.all"
                  :indeterminate="props.indeterminate"
                  primary
                  hide-details
                  @click.stop="toggleAll"
                ></v-checkbox>
              </th>
              <th
                v-for="header in props.headers"
                :key="header.text"
                :class="['column sortable', pagination.descending ? 'desc' : 'asc', header.value === pagination.sortBy ? 'active' : '']"
                @click="changeSort(header.value)"
              >
                <v-icon small>arrow_upward</v-icon>
                {{ header.text }}
              </th>
            </tr>
          </template>
          <template v-slot:items="props">
            <tr>
              <td :active="props.selected" @click="props.selected = !props.selected">
                  <v-checkbox :input-value="props.selected" primary hide-details></v-checkbox>
                </td>
                <td>{{props.item.index+1}}</td>
                <td v-if="mode=='customer'" class="text-capitalize name-linking">
                  <router-link :to="'/'+$route.params.username+'/Dashboard/sales/customer/'+props.item.id+'/view'">
                    {{props.item.name}}
                  </router-link>
                </td>
                <td v-else  class="text-capitalize name-linking">
                  <router-link :to="'/'+$route.params.username+'/Dashboard/purchase/supplier/'+props.item.id+'/view'">
                    {{props.item.name}}
                  </router-link>
                </td>
                <td>{{ props.item.mobile }}</td>
                <td>{{ props.item.totalamount }}</td>
                <td v-if="mode == 'customer'">{{ props.item.received }}</td>
                <td v-else-if="mode == 'supplier'">{{ props.item.paid }}</td>
                <td v-if="mode == 'customer'"> {{parseFloat(props.item.totalamount) - parseFloat(props.item.received)}} </td>
                <td v-if="mode == 'supplier'"> {{parseFloat(props.item.totalamount) - parseFloat(props.item.paid)}} </td>
                <td>
                  <v-btn icon flat @click="editCustomer(props.item.id)">
                    <v-icon class="grey--text text--darken-2" >edit</v-icon>
                  </v-btn>
                </td>
              </tr>  
          </template>
        </v-data-table>
        </v-card-text>
        </v-card>
    </div>  
</template>
<script>
  export default {
    props:{
        value: {
            type: String,
            required: false
        },
        modalAction:{
            type: Number,
            required: false
        },
        mode:{
            type: String,
            required: true
        }
    },
    data() {
      return {
        header: [{
          text: '#',
          align: 'left',
          sortable: false,
          value: 'name'
        },
        { text: 'Name', value: 'name', sortable: false },
        { text: 'Mobile', value: 'mobile' },
        { text: 'Total Amount', value: 'totalamount' },
        { text: 'Total Recieved', value: 'received' },
        { text: 'Total Recievables', value: 'pending' },
        { text: 'Edit', value: 'name' }],
        loading: true,
        pagination: {},
        customerDtl: [],
        selectCustomer: [],
        search: '',
        totalCustomer: 0,
        loadingPDF:false,
        loadingExcel:false
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
      },
      modalAction: {
          handler() {
            if(this.modalAction == 2)
            {
                this.getDataFromApi()
                  .then(data => {
                    this.customerDtl = data.items
                    this.totalCustomer = data.total
                })
            }
          }
      },
      search: {
          handler() {
              this.getDataFromApi()
                  .then(data => {
                    this.customerDtl = data.items
                    this.totalCustomer = data.total
                })
          }
      }
    },
    mounted() {
        if(this.mode == 'supplier'){
            this.header[4].text = "Total Paid"
            this.header[4].value = "paid"
            this.header[5].text = "Payable Amount"
        }
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
              if(this.mode == 'customer') {
              this.$axios.post("/" + this.$route.params.username + "/api/Customers/update?access_token="+this.$store.state.token+"&where[id]=" + this.selectCustomer[i].id,
                {
                  isenabled: 0
                })
                .then(res => {
                  //console.log("customer="+res.data);
                  this.$axios.post("/" + this.$route.params.username + "/api/Orders/update?access_token="+this.$store.state.token+"&where[customerId]=" + this.selectCustomer[i].id,
                    {
                      isenabled: 0
                    })
                    .then(res1 => {
                      resolve("1");
                    });

                });
              }
              else if(this.mode == 'supplier')
              {
                  this.$axios.post("/"+this.$route.params.username+"/api/Suppliers/update?access_token="+this.$store.state.token+"&where[id]="+this.selectCustomer[i].id,
                        {
                            isenabled:0
                        })
                        .then(res => {
                        this.$axios.post("/"+this.$route.params.username+"/api/Purchases/update?access_token="+this.$store.state.token+"&where[supplierId]="+this.selectCustomer[i].id,
                            {
                                isenabled:0
                            })
                                .then(res1 => {
                                    resolve("1");

                                });
                            
                        });
              }
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
      },
      _export(type){
          if(type == "pdf") this.loadingPDF = true
          else this.loadingExcel = true
          const { sortBy, descending, page, rowsPerPage } = this.pagination
          //console.log("aa")
          this.getDataFromApi()
          .then(res => {
              let item = res.items;
              let header = []
              header[0] = []
              for(let i = 0;i<this.header.length;i++) if(this.header[i].text != 'Edit') header[0].push(this.header[i].text)
              let body = []
              for(let i = 0;i<item.length;i++)
              {
                if(this.mode == 'customer')
                {
                  body[i] = [(item[i].index+1),item[i].name,item[i].mobile,item[i].totalamount,item[i].received,(item[i].totalamount - item[i].received)]
                }
                else if(this.mode == 'supplier'){
                  body[i] = [(item[i].index+1),item[i].name,item[i].mobile,item[i].totalamount,item[i].paid,(item[i].totalamount - item[i].paid)]
                }
              }
              let name = this.mode == 'customer' ? "Customer" : "Supplier"
              if(type == "pdf") {
                this.$createPDF(header,body,name + " Listing",process)
                    .then((resolve)=>{this.loadingPDF=false})
              }
              else {
                  this.$createExcel(header,body,name + " Listing",process)
                    .then((resolve)=>{this.loadingExcel=false})
              }
            });
      },
      getDataFromApi() {
        this.loading = true
        return new Promise((resolve, reject) => {
          const { sortBy, descending, page, rowsPerPage } = this.pagination
          //console.log("aa")
          let items = "";
          if(this.mode == 'customer')
          {
              this.$axios.get('/'+this.$route.params.username+'/api/Customers/getCustomers?access_token='+this.$store.state.token+'&filter={"skip":"'+parseInt(rowsPerPage * (page-1))+'","limit":"'+rowsPerPage+'","search":"'+this.search+'","sort":"'+sortBy+'","descending":"'+descending+'"}')
            .then(res => {
              //console.log("bb")
              items = res.data.data;
              //console.log("cc")
              const total = res.data.total
              this.loading = false
              resolve({
                items,
                total
              })
              //console.log(res.data)
            });
          }
          else if(this.mode == 'supplier')
          {
              this.$axios.get('/'+this.$route.params.username+'/api/Suppliers/getSuppliers?access_token='+this.$store.state.token+'&filter={"skip":"'+parseInt(rowsPerPage * (page-1))+'","limit":"'+rowsPerPage+'","search":"'+this.search+'","sort":"'+sortBy+'","descending":"'+descending+'"}')
            .then(res => {
              //console.log("bb")
              items = res.data.data;
              //console.log("cc")
              const total = res.data.total
              this.loading = false
              resolve({
                items,
                total
              })
              //console.log(res.data)
            });
          }
        })
      },
      editCustomer(id){
          this.$emit("input",id)
      }
    }
  }
</script>
<style>

</style>