<template>
    <v-layout row wrap>
        <v-flex xs12>
            <v-card flat>
                <v-card-text class="grey lighten-3">
                    <v-layout>
                        <v-flex sm12>
                            <v-card class="border-radius-5">
                                <v-card-text>
                                    <v-layout align-center justify-start row wrap class="ma-3">
                                        <v-flex xs12 sm2>
                                            <v-label class="font-15 font-weight-regular ">Select SubType Name: </v-label>
                                        </v-flex>
                                        <v-flex xs12 sm3>
                                            <v-select :items="subTypes" clearable menu-props="offsetY" item-text="name" item-value="id" v-model="selectedSubType"
                                                height=25 class=" " @change="addItemStock=[]"></v-select>
                                        </v-flex>
                                        <v-flex sm4></v-flex>
                                        <v-flex xs12 sm3 v-if="showItem==1">
                                            <v-dialog ref="startdate" v-model="Datemodal" :return-value.sync="itemDate"
                                                persistent lazy full-width width="290px">
                                                <template v-slot:activator="{ on }">
                                                    <v-text-field v-model="itemDate"  prepend-icon="event"
                                                        readonly v-on="on"></v-text-field>
                                                </template>
                                                <v-date-picker v-model="itemDate" scrollable>
                                                    <v-spacer></v-spacer>
                                                    <v-btn flat color="primary" @click="Datemodal = false">Cancel</v-btn>
                                                    <v-btn flat color="primary" @click="$refs.startdate.save(itemDate)">OK</v-btn>
                                                </v-date-picker>
                                            </v-dialog>
                                        </v-flex>
                                    </v-layout>
                                    <v-data-table v-if="showItem==1" :headers="itemheaders" :items="addItemStock" hide-actions class="elevation-0 mb3">
                                        <template v-slot:items="props">
                                            <td width="45%">
                                                <v-text-field disabled label="" type=text v-model="props.item.name" class="pa-0 ma-0"></v-text-field>
                                            </td>
                                            <td width="10%">
                                                <v-text-field label="" type=number v-model="props.item.quantity" class="pa-0 ma-0"></v-text-field>
                                            </td>
                                            <td width="15%">
                                            <v-text-field label="" type=number v-model="props.item.price" class="pa-0 ma-0"></v-text-field>
                                            </td>
                                            
                                            <td width="30%">
                                            <v-text-field label="" type=text class="pa-0 ma-0" v-model="props.item.notes"></v-text-field>
                                            </td>
                                            
                                        </template>
                                    </v-data-table>
                                    <v-layout v-if="showItem==1" align-center justify-start row wrap>
                                        <v-flex sm10></v-flex>
                                        <v-flex sm2 text-xs-right>
                                            <v-btn color="black" type=button :loading="btnLoading" @click="addAllStock" style="color:white" class="ma-0 pa-0" >
                                                <v-icon dark small class="mr-1"> edit</v-icon>Add
                                            </v-btn>
                                        </v-flex>
                                    </v-layout>    
                                </v-card-text>
                            </v-card>
                        </v-flex>
                    </v-layout>
                </v-card-text>
            </v-card>
        </v-flex>
    </v-layout>                                    
</template>
<script>
export default {
    layout:"dashboard",
    created(){
        this.generate();
    },
    watch: {
      selectedSubType: {
        handler() {
          if(this.selectedSubType != null)
          {
              this.getItem()
          }
          else{
              this.showItem=0;
              this.addItemStock=[];
          }
        },
        deep: true
      }
    },
    data()
    {
        return{
            subTypes:[],
            selectedSubType:'',
            Datemodal:false,
            addItemStock:[],
            btnLoading:false,
            showItem:0,
            validItemStock:[],
            itemDate:null,
            itemheaders:[{text:'Item Name',value:"Item Name",sortable:false},{text:'Quantity',value:"Quantity",sortable:false},{text:'Price',value:"Price",sortable:false},{text:'Notes',value:"Notes",sortable:false}]
        }
    },
    methods:{
        async generate(){
            await this.$axios.get("/"+this.$route.params.username+"/api/Subtypes?access_token="+this.$store.state.token+"&filter[where][isenabled]=1")
            .then(res=>{
                this.subTypes=res.data
            })
        },
        async getItem()
        {   
            await this.$axios.get("/"+this.$route.params.username+"/api/Items?access_token="+this.$store.state.token+"&filter[where][isenabled]=1&filter[where][subTypeId]="+this.selectedSubType)
            .then(res=>{
                let date=new Date();
                        let month = ""+(date.getMonth()+1)
                        let date1 = ""+(date.getDate())
                        if((date.getMonth()+1) < 10) month="0"+(date.getMonth()+1)
                        if(date.getDate() < 10) date1="0"+date.getDate()
                        let date2=date.getFullYear() + "-" + month + '-' + date1;
                        this.itemDate=date2;
                for(let i=0;i<res.data.length;i++){
                    this.addItemStock.push({
                        itemId:res.data[i].id,
                        name:res.data[i].name,
                        quantity:null,
                        price:res.data[i].price,
                        notes:'',
                        totalStock:res.data[i].totalstock
                    })
                }
                    this.showItem=1;
                    //console.log(this.selectedSubType+"-- "+res.data.length)

            }) 
        },
        addAllStock(){
            this.btnLoading=true;   
            let promise1 = new Promise((resolve,reject)=>{
                //let a=0
                this.validItemStock = []
                for(let j=0;j<this.addItemStock.length;j++){
                    if(this.addItemStock[j].quantity>0 && this.addItemStock[j].price > 0){
                        
                        this.validItemStock.push({
                            itemId:this.addItemStock[j].itemId,
                            quantity:this.addItemStock[j].quantity,
                            price:this.addItemStock[j].price,
                            notes:this.addItemStock[j].notes,
                            date:this.itemDate,
                            isenabled:1,
                            createdon:new Date(new Date().getTime() - (new Date().getTimezoneOffset() * 60000)).toISOString(),
                            createdById:this.$store.state.userId,
                            modifiedon:new Date(new Date().getTime() - (new Date().getTimezoneOffset() * 60000)).toISOString(),
                            modifiedById:this.$store.state.userId
                        })
                        //console.log("aa")
                    }
                    if(j == this.addItemStock.length-1) resolve()
                }
            });
            promise1.then((resolve)=>{
                if(this.validItemStock.length>0){
                    this.$axios.post("/"+this.$route.params.username+"/api/Stocklogs?access_token="+this.$store.state.token,this.validItemStock)
                    .then(res=>{
                        console.log(this.validItemStock)
                        this.$axios.post("/"+this.$route.params.username+"/api/Stocklogs/updatetotalstock?access_token="+this.$store.state.token,{itemId:this.validItemStock})
                                .then(res1=>{
                                    if(res1.status){
                                        this.btnLoading=false;
                                    this.showItem=0;
                                    this.selectedSubType=null;
                                    this.validItemStock=[];
                                    this.addItemStock=[];
                                    }
                                });
                    })
                }
                else{
                    this.btnLoading=false;
                }
            });
        }
    }
}
</script>
