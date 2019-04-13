<template>
    <v-layout>
        <v-flex sm12>
        <v-card class="border-radius-5">
                <v-card-text>
                    <v-layout  align-end justify-end row wrap>
                        <v-btn color="info" round class="pa-2" @click="showModal = true,editValue=null">
                            <v-icon dark small class="mr-2"> flash_on</v-icon>Add Type
                        </v-btn>
                    </v-layout>    
                    <v-layout row wrap class="mb-2">
                        <v-flex sm1 xs3>
                            <v-btn v-if="selectType.length > 0" color="error" round class="pa-0" @click="deleteType">
                                        <v-icon dark small class="mr-1">delete</v-icon> Delete
                            </v-btn>
                        </v-flex>
                        <v-flex sm11 xs9></v-flex>
                    </v-layout>    
                    <v-card class="elevation-5" style="border-radius:5px;">
                        <v-card-title  class="pa-2 primary white--text">
                            List of All Types:-
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
                    <v-data-table v-model="selectType" :headers="header" :items="typeDtl" :pagination.sync="pagination"
                    :total-items="totalType" :loading="loading" select-all item-key="id" class="elevation-0">
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
                            style="text-align:left;"
                        >
                            <v-icon small>arrow_upward</v-icon>
                            {{ header.text }}
                        </th>
                        </tr>
                        </template>
                        <template v-slot:items="props">
                            <tr>
                                <td width="9%" :active="props.selected" @click="props.selected = !props.selected">
                                    <v-checkbox :input-value="props.selected" primary hide-details></v-checkbox>
                                </td>
                                <td width="6%">{{props.item.index+1}}</td>
                                <td width="75%" @click="editType(props.item.id)" style="cursor:pointer;" class="text-capitalize name-linking text-lg-left mr-3">{{ props.item.name }}</td>
                                <td v-if="(taxprop_p==1 || taxprop_s==1)">
                                    <span v-if="props.item.taxId != ''">{{props.item.tax.percentage}}</span>
                                    <span v-else>-</span>
                                </td>
                                <td width="10%">
                                    <v-icon small class="mr-12" @click="editType(props.item.id)">edit
                                    </v-icon>
                                </td>
                                
                            </tr>
                        </template>
                    </v-data-table>
                    </v-card-text>
                   </v-card> 
                    <v-dialog width="400" v-model="showModal" >
                        <v-card>
                            <v-card-title class="pt-2 pb-2" style="border-bottom:1px solid #A5A5A5;">
                            <span style="font-size:18px;" v-if="editValue==null">Add Type</span>
                            <span style="font-size:18px;" v-else>Edit Type</span>
                            </v-card-title>
                            <v-card-text class="pa-0">
                            <v-container grid-list-xs>
                                <addEditType v-if="showModal==true" v-model="closeModal1" :id="editValue"></addEditType>
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
import addEditType from '@/components/Items/addEditType.vue';
export default {
    components:{
        addEditType
    },
    created(){
        this.getTaxProp();
    },
    data() {
      return {
        header: [{
          text: '#',
          align: 'left',
          sortable: false,
          value: 'name'
        },
        { text: 'Type', value: 'name' },
        {
            text:'Tax(%)',value:'tax'
        },
        { text: 'Edit', value: 'name' }],
        loading: true,
        pagination: {},
        url: process.env.URL,
        typeDtl: [],
        selectType: [],
        search: '',
        addinBulk: 0,
        showModal: false,
        totalType: 0,
        editValue:null,
        closeModal1:1,
        taxprop_p: 0,
        taxprop_s: 0,
        loadingPDF:false,
        loadingExcel:false
      }
    },
    updated(){
        //console.log(this.selectType)
        if(this.closeModal1 == 2)
        {
            this.showModal = false
            this.closeModal1=1
            this.getDataFromApi()
                .then(data => {
                  this.typeDtl = data.items
                  this.totalType = data.total
            })
            
        }
    },
    watch: {
      pagination: {
        handler() {
          this.getDataFromApi()
            .then(data => {
              this.typeDtl = data.items
              this.totalType = data.total
            })
        },
        deep: true
      },
      search: {
          handler() {
              this.getDataFromApi()
                  .then(data => {
                    this.typeDtl = data.items
                    this.totalType = data.total
                })
          }
      }
    },
    mounted() {
      this.getDataFromApi()
        .then(data => {
          this.typeDtl = data.items
          this.totalType = data.total
        })
    },
    methods:{
        async getTaxProp() {
                await this.$axios.get("/" + this.$route.params.username + "/api/Configurations?access_token=" + this.$store.state.token)
                    .then(res1 => {
                        let promise1 = new Promise((resolve,reject)=>{
                        
                                for (let i = 0; i < res1.data.length; i++) {
                                if (res1.data[i].alias == "calculate_taxes_sales") {
                                    this.taxprop_s = res1.data[i].value
                                }
                                else if (res1.data[i].alias == "calculate_taxes_purchase") this.taxprop_p = res1.data[i].value
                            }
                            resolve()
                        });
                        promise1.then((resolve)=>{
                            if(this.taxprop_p==0 && this.taxprop_s==0){
                                this.header.splice(2,1)
                            }
                        });
                        
                    });
                    
            },
        toggleAll() {
        if (this.selectType.length) this.selectType = []
        else this.selectType = this.typeDtl.slice()
      },
      changeSort(column) {
        if (this.pagination.sortBy === column) {
          this.pagination.descending = !this.pagination.descending
        } else {
          this.pagination.sortBy = column
          this.pagination.descending = false
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
                  if(this.taxprop_p==0 && this.taxprop_s==0) {
                    body[i] = [(item[i].index+1),item[i].name]
                  }
                  else {
                    body[i] = [(item[i].index+1),item[i].name,item[i].tax.percentage]
                  }
              }
              if(type == "pdf") {
                this.$createPDF(header,body,"Type Listing",process)
                    .then((resolve)=>{this.loadingPDF=false})
              }
              else {
                  this.$createExcel(header,body,"Type Listing",process)
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
          this.$axios.get('/'+this.$route.params.username+'/api/Types/getTypes?access_token='+this.$store.state.token+'&filter={"skip":"'+parseInt(rowsPerPage * (page-1))+'","limit":"'+rowsPerPage+'","search":"'+this.search+'","sort":"'+sortBy+'","descending":"'+descending+'"}')
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
        })
      },
      async deleteType(){

           if (confirm("Do you really want to delete?")) 
           {   
                let promise = new Promise((resolve,reject)=>{ 
                    for (let i = 0; i < this.selectType.length; i++) {
                            //console.log(this.selectCustomer[i]);
                            this.$axios.post("/" + this.$route.params.username + "/api/Types/update?access_token=" + this.$store.state.token + "&where[id]=" + this.selectType[i].id,
                                {
                                    isenabled: 0
                                })
                                .then(res => {
                                    this.$axios.post("/" + this.$route.params.username + "/api/Subtypes/update?access_token=" + this.$store.state.token + "&where[typeId]=" + this.selectType[i].id,
                                        {
                                            isenabled: 0
                                        })
                                        .then(res1 => {
                                            resolve("1");
                                        });
                                });
                    }
               });    
               promise.then((resolve)=>{
                    if(resolve=="1"){
                        //alert("Successfully Deleted")
                        //window.location="";
                        this.getDataFromApi()
                            .then(data => {
                            this.typeDtl = data.items
                            this.totalType = data.total
                            })
                    }
                })
                
            }
            else{}
        },
      editType(val){
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