<template>
    <v-form @submit.prevent="addStock" ref="form1" lazy-validation onkeypress="return event.keyCode != 13">
                <v-layout align-center justify-start row wrap class="mb-2">
                        <v-flex xs12 sm12>
                            <label class="font-16 font-weight-regular">Item Name </label>
                                <v-autocomplete  v-model="addStockDtl.itemId" :items="itemListitems"
                                                :rules="requiredRules" class="ma-0 pa-0" auto-select-first clearable append-icon="search"
                                                :loading="itemList.isLoading" :search-input.sync="itemList.search"
                                                hide-no-data hide-selected item-text="name" item-value="id" label=""
                                                placeholder="" return-string height=25 >
                                </v-autocomplete>
                        </v-flex>    
                    </v-layout>
                    <v-layout align-center justify-start row wrap class="mb-2">
                        <v-flex xs12 sm12>
                            <label class="font-16 font-weight-regular">Quantity </label>
                                <v-text-field
                                    class="pa-0 ma-0"
                                    label=""
                                    height=25
                                    :rules="requiredRules"
                                    v-model="addStockDtl.quantity"
                                    type=number
                                ></v-text-field>
                        </v-flex>    
                    </v-layout>
                    <v-layout align-center justify-start row wrap class="mb-2">
                        <v-flex xs12 sm12>
                            <label class="font-16 font-weight-regular">Price </label>
                                <v-text-field
                                    class="pa-0 ma-0"
                                    label=""
                                    height=25
                                    type=number
                                    v-model="addStockDtl.price"
                                ></v-text-field>
                        </v-flex>    
                    </v-layout>
                    <v-layout align-center justify-start row wrap class="mb-2">
                        <v-flex xs12 sm12>
                            <label class="font-16 font-weight-regular">Date </label>
                                <v-dialog ref="enddate" v-model="Datemodal" :return-value.sync="addStockDtl.date" persistent
                                lazy full-width width="290px">
                                <template v-slot:activator="{ on }">
                                    <v-text-field v-model="addStockDtl.date" label="" class="ma-0 pa-0" prepend-icon="event" readonly
                                        v-on="on"></v-text-field>
                                </template>
                                <v-date-picker v-model="addStockDtl.date" scrollable>
                                    <v-spacer></v-spacer>
                                    <v-btn flat color="primary" @click="Datemodal = false">Cancel</v-btn>
                                    <v-btn flat color="primary" @click="$refs.enddate.save(addStockDtl.date)">OK</v-btn>
                                </v-date-picker>
                            </v-dialog>
                        </v-flex>    
                    </v-layout>
                    <v-layout align-center justify-start row wrap class="">
                        <v-flex xs12 sm12>
                            <label class="font-16 font-weight-regular">Notes </label>
                                <v-text-field
                                    class="pa-0 ma-0"
                                    label=""
                                    height=25
                                    type=text
                                ></v-text-field>
                        </v-flex>    
                    </v-layout>  
                    <v-layout align-center justify-start row wrap>
                        
                        <v-flex xs12 sm12>
                    <v-layout align-start justify-end>

                            <v-btn color="info" round type=submit>
                                <v-icon dark small class="mr-1"> edit</v-icon>Add
                            </v-btn>
                            </v-layout>
                        </v-flex>
                    </v-layout>
              </v-form>
</template>
<script>
let date=new Date();
let month = ""+(date.getMonth()+1)
let date1 = ""+(date.getDate())
if((date.getMonth()+1) < 10) month="0"+(date.getMonth()+1)
if(date.getDate() < 10) date1="0"+date.getDate()
export default {
    props:{
        value:{
            type: Number,
            required: false
        }
    },
   
   created(){

    },
    data(){
        return{
            url:process.env.URL,
            addStockDtl:{
                itemId:"",
                quantity:null,
                price:null,
                date:date.getFullYear() + "-" + month + '-' + date1,
                note:""
            },
            itemList: {
                        isLoading: false,
                        search: null,
                        entries: []
            },
            requiredRules: [
                    v => !!v || 'This Field is required'
            ],
            btnLoading:false,
            Datemodal:false
        }
    },
    watch: {
            'itemList.search': function (val) {
                // Items have already been requested
                if (this.itemList.isLoading) return
                this.itemList.isLoading = true

                // Lazily load input items
                this.$axios.get('/' + this.$route.params.username + '/api/Items/itemNames?access_token='+this.$store.state.token+'&names=' + val)
                    .then(res => {
                        let { values } = res.data
                        this.itemList.entries = values
                        
                    })
                    .catch(err => {
                        //console.log(err)
                    })
                    .finally(() => (this.itemList.isLoading = false))
            }
    },
    computed: {
           itemListitems() {
                return this.itemList.entries.map(entry => {
                    const name = entry.name.length > this.descriptionLimit
                        ? entry.name.slice(0, this.descriptionLimit) + '...'
                        : entry.name
                    const id = entry.id
                    return Object.assign({}, entry, { id, name })
                })
            }
    },                
    methods:{
        async addStock(){
            if (this.$refs.form1.validate())
            {    if(this.addStockDtl.date != null)
                {
                    let date=new Date(this.addStockDtl.date);
                    let month = ""+(date.getMonth()+1)
                    let date1 = ""+(date.getDate())
                    if((date.getMonth()+1) < 10) month="0"+(date.getMonth()+1)
                    if(date.getDate() < 10) date1="0"+date.getDate()
                    this.addStockDtl.date=date.getFullYear() + "-" + month + '-' + date1;
                }
                this.$axios.post("/"+this.$route.params.username+"/api/Stocklogs?access_token="+this.$store.state.token,{
                    itemId:this.addStockDtl.itemId,
                    quantity:this.addStockDtl.quantity,
                    date:this.addStockDtl.date,
                    price:this.addStockDtl.price,
                    notes:this.addStockDtl.note,
                    createdon:new Date(new Date().getTime() - (new Date().getTimezoneOffset() * 60000)).toISOString(),
                    modifiedon:new Date(new Date().getTime() - (new Date().getTimezoneOffset() * 60000)).toISOString(),
                    createdById:this.$store.state.userId,
                    modifiedById:this.$store.state.userId,
                    isenabled:1
                })
                .then(res => {
                    this.$axios.get("/"+this.$route.params.username+"/api/Items/"+this.addStockDtl.itemId+"?access_token="+this.$store.state.token)
                    .then(res=>{
                        let totalstock = parseFloat(res.data.totalstock) + parseFloat(this.addStockDtl.quantity)
                        this.$axios.post("/"+this.$route.params.username+"/api/Items/update?where[id]="+this.addStockDtl.itemId+"&access_token="+this.$store.state.token,
                        {
                            totalstock : totalstock
                        })
                        .then(res1=>{
                            //alert("Stock Added Succesfully")
                            //window.location=""
                            this.$emit('input', 2);
                        })
                    })
                });
            }
        }
        
    }
}
</script>
