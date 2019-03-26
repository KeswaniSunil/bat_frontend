<template>
    <v-layout>
        <v-flex sm12>
            <v-card class="border-radius-5">
                <v-card-text >
                    <v-layout  align-center justify-start row wrap>
                        <v-flex xs7 sm10></v-flex>
                        <v-flex xs5 sm2>
                            <v-layout  align-center justify-start row wrap>
                                <v-flex sm4></v-flex>
                                <v-flex sm8>
                                    <v-btn color="info" round class="pa-2" @click="showModal = true,editValue=null">
                                            <v-icon dark small class="mr-2"> gavel</v-icon>Add Item
                                    </v-btn>
                                </v-flex>    
                            </v-layout>
                        </v-flex>
                    </v-layout>    
                    <v-layout column class="pb-2" >
                        <v-flex sm12>
                            <v-layout align-center row wrap>
                                <v-flex xs3 sm1>
                                    <v-btn v-if="selectItem.length > 0" color="error" round class="pa-0" @click="deleteItem">
                                        <v-icon dark small class="mr-1">gavel</v-icon> Delete
                                    </v-btn>
                                </v-flex>
                                <v-flex xs9 sm8></v-flex>
                                <v-flex xs12 sm3>
                                <v-text-field v-model="search" append-icon="search" label="Search" single-line hide-details></v-text-field></v-flex>
                            </v-layout>
                        </v-flex>
                    </v-layout>
                    
                    <v-data-table v-model="selectItem" :headers="header" :items="itemDtl" :pagination.sync="pagination"
                    :total-items="totalItem" :loading="loading" select-all item-key="id" class="elevation-1">
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
                        <template v-slot:no-data>
                            <v-alert :value="true" color="error" icon="warning">
                            Sorry, nothing to display here :(
                            </v-alert>
                        </template>
                        <template v-slot:items="props">
                            <tr>
                                <td :active="props.selected" @click="props.selected = !props.selected">
                                    <v-checkbox :input-value="props.selected" primary hide-details></v-checkbox>
                                </td>
                                <td>{{props.index+1}}</td>
                                <td>{{ props.item.name }}</td>
                                <td>{{ props.item.billname }}</td>
                                <td>{{ props.item.unit.title }}</td>
                                <td>{{ props.item.price }}</td>
                                <td>{{ props.item.totalstock }}</td>
                                <td>{{ props.item.usedstock }}</td>
                                <td>{{ props.item.totalstock - props.item.usedstock }}</td>
                                <td>
                                    <v-icon small class="mr-12" @click="editItem(props.item.id)">edit
                                    </v-icon>
                                </td>
                            </tr>
                        </template>
                        <v-alert v-slot:no-results :value="true" color="error" icon="warning">
                            Your search for "{{ search }}" found no results.
                        </v-alert>
                    </v-data-table>
                    
                    <v-dialog width="800" v-model="showModal" >
                        <v-card>
                            <v-card-title class="pt-2 pb-2" style="border-bottom:1px solid #A5A5A5;">
                            <span style="font-size:18px;" v-if="editValue==null">Add Item</span>
                            <span style="font-size:18px;" v-else>Edit Item</span>
                            </v-card-title>
                            <v-card-text class="pa-0">
                            <v-container grid-list-xs>
                                <addEditItem v-if="showModal==true" v-model="closeModal1" :id="editValue"></addEditItem>
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
import addEditItem from '@/components/Items/addEditItems.vue';
export default {
    components:{
        addEditItem
    },
    created(){
        this.$store.state.token ='5FIQwvmvvuUCeQqfSqT1xCmGf7GdvJe4SUTPTUQ5Q2om9vxss8CadPNHCeVjP23L'
            this.$store.state.userId=1
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
        { text: 'Bill Name', value: 'billname' },
        { text: 'Unit', value: 'unit' },
        { text: 'Price', value: 'price' },
        { text: 'Total Stock', value: 'totalstock' },
        { text: 'Used Stock', value: 'usedstock' },
        { text: 'Available Stock', value: 'availablestock' },
        { text: 'Edit', value: 'edit' }],
        loading: true,
        pagination: {},
        url: process.env.URL,
        itemDtl: [],
        selectItem: [],
        search: '',
        addinBulk: 0,
        showModal: false,
        showBulk: false,
        totalItem: 0,
        editValue:null,
        closeModal1:1
      }
    },
    updated(){
        //console.log(this.selectItem)
        if(this.closeModal1 == 2)
        {
            this.showModal = false
            this.closeModal1=1
            this.getDataFromApi()
                .then(data => {
                  this.itemDtl = data.items
                  this.totalItem = data.total
            })
        }
    },
    watch: {
      pagination: {
        handler() {
          this.getDataFromApi()
            .then(data => {
              this.itemDtl = data.items
              this.totalItem = data.total
            })
        },
        deep: true
      }
    },
    mounted() {
      this.getDataFromApi()
        .then(data => {
          this.itemDtl = data.items
          this.totalItem = data.total
        })
    },
    methods:{
        toggleAll() {
        if (this.selectItem.length) this.selectItem = []
        else this.selectItem = this.itemDtl.slice()
      },
      changeSort(column) {
        if (this.pagination.sortBy === column) {
          this.pagination.descending = !this.pagination.descending
        } else {
          this.pagination.sortBy = column
          this.pagination.descending = false
        }
      },
      getDataFromApi() {
        this.loading = true
        return new Promise((resolve, reject) => {
          const { sortBy, descending, page, rowsPerPage } = this.pagination
          //console.log("aa")
          let items = "";
          this.$axios.get("/"+this.$route.params.username+"/api/Items?access_token="+this.$store.state.token+"&filter[where][isenabled]=1&filter[include]=unit&filter[include][subType]=type")
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
      async deleteItem(){

           if (confirm("Do you really want to delete?")) 
           {   
                let promise = new Promise((resolve,reject)=>{ 
                    for(let i=0;i<this.selectItem.length;i++)
                    {
                        //console.log(this.selectCustomer[i]);
                        this.$axios.post("/"+this.$route.params.username+"/api/Items/update?access_token=5FIQwvmvvuUCeQqfSqT1xCmGf7GdvJe4SUTPTUQ5Q2om9vxss8CadPNHCeVjP23L&where[id]="+this.selectItem[i].id,
                        {
                            isenabled:0
                        })
                        .then(res => {
                            this.$axios.post("/"+this.$route.params.username+"/api/Stocklogs/update?access_token=5FIQwvmvvuUCeQqfSqT1xCmGf7GdvJe4SUTPTUQ5Q2om9vxss8CadPNHCeVjP23L&where[itemId]="+this.selectItem[i].id,
                            {
                                isenabled:0
                            })
                            .then(res1 => {
                                resolve("1");
                            })
                            
                        });
                    }
               });    
               promise.then((resolve)=>{
                    if(resolve=="1"){
                        //alert("Successfully Deleted")
                        //window.location="";
                        this.getDataFromApi()
                            .then(data => {
                            this.itemDtl = data.items
                            this.totalItem = data.total
                            })
                    }
                })
                
            }
            else{}
        },
      editItem(val){
            this.editValue = "";
              if(this.editValue =="")
              {
                  this.editValue =val
                  this.showModal = true
                  //console.log(this.editValue)
              }
              //console.log(this.editValue)
        }
    }

}
</script>