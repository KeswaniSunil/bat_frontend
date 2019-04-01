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
                <v-flex xs9 sm8></v-flex>
                <v-flex xs12 sm3>
                  <v-text-field v-model="search" append-icon="search" label="Search" single-line hide-details></v-text-field>
                </v-flex>
              </v-layout>
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
                <td @click="editCustomer(props.item.id)" class="text-capitalize name-linking">{{ props.item.name }}</td>
                <td>{{ props.item.mobile }}</td>
                <td>{{ props.item.totalamount }}</td>
                <td v-if="mode == 'customer'">{{ props.item.received }}</td>
                <td v-else-if="mode == 'supplier'">{{ props.item.paid }}</td>
                <td v-if="mode == 'customer'"> {{parseFloat(props.item.totalamount) - parseFloat(props.item.received)}} </td>
                <td v-if="mode == 'supplier'"> {{parseFloat(props.item.totalamount) - parseFloat(props.item.paid)}} </td>
                <td>
                  <v-icon class="mr-12" @click="editCustomer(props.item.id)">edit
                  </v-icon>
                </td>
              </tr>  
          </template>
        </v-data-table>
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
                  this.$axios.post("/"+this.$route.params.username+"/api/Suppliers/update?access_token="+this.$store.state.token+"&where[id]="+this.selectSupplier[i],
                        {
                            isenabled:0
                        })
                        .then(res => {
                        this.$axios.post("/"+this.$route.params.username+"/api/Purchases/update?access_token="+this.$store.state.token+"&where[supplierId]="+this.selectSupplier[i],
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