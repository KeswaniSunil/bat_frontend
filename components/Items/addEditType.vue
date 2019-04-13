<template>
    <v-form @submit.prevent="addType" ref="form1" lazy-validation onkeypress="return event.keyCode != 13">
        
            <v-layout align-center justify-start row wrap class="mb-3">
                <v-flex xs12 sm12>
                    <v-text-field label="Type Name" type=text  :rules="requiredRules" v-model="typeName" height=25 class="pa-0 mt-1"></v-text-field>
                </v-flex>
            </v-layout>
            <v-layout align-center justify-start row wrap class="mb-1" v-if="taxprop_p == 1 || taxprop_s == 1">
                <v-flex xs12 sm12>
                    <v-select :items="taxes" label="Tax" item-text="name" item-value="id" v-model="selectedTax"
                     height=25 class="pa-0 mt-1"   ></v-select>
                </v-flex>
            </v-layout>
            <v-layout align-center justify-start row wrap>
                <v-flex xs12 sm12>
                    <v-layout align-start justify-end>
                    <v-btn v-if="propCheck==0" class="" :loading="btnLoading" type="submit" color="info" round dark >
                        Add
                        <v-icon dark right class="ml-1">check_circle</v-icon>
                    </v-btn>
                    <v-btn v-else class="" :loading="btnLoading" type="submit" color="info" round dark>
                        Save
                        <v-icon dark right class="ml-1">check_circle</v-icon>
        
                    </v-btn>
                    </v-layout>
                </v-flex>
            </v-layout>
    </v-form>                
</template>
<script>
export default {
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
            this.propCheck=1,
            this.fillData()
        }
        this.getTaxProp()
    },
    data(){
        return{
            typeName:"",
            selectedTax:"",
            taxes:[],
            propCheck:0,
            taxprop_s:0,
            taxprop_p:0,
            requiredRules: [
                v => !!v || 'This Field is required'
            ],
           biggerScreen:true,
           btnLoading:false
        }
    },
    methods:{
        async addType(){
            if (this.$refs.form1.validate())
            {   
                this.btnLoading=true
                if(this.propCheck==0){
                    await this.$axios.post("/"+this.$route.params.username+"/api/Types?access_token="+this.$store.state.token,{
                            name:this.typeName,
                            isenabled:1,
                            taxId:this.selectedTax,
                            createdon:new Date(new Date().getTime() - (new Date().getTimezoneOffset() * 60000)).toISOString(),
                            modifiedon:new Date(new Date().getTime() - (new Date().getTimezoneOffset() * 60000)).toISOString(),
                            createdById:this.$store.state.userId,
                            modifiedById:this.$store.state.userId

                        })
                            .then(res => {
                                //alert("Type Succesfully Added")
                            // window.location=""
                            this.btnLoading=false
                            this.$emit('input', 2);
                            });
                }
                else{
                    await this.$axios.post("/"+this.$route.params.username+"/api/Types/update?access_token="+this.$store.state.token+"&where[id]="+this.id,{
                            name:this.typeName,
                            isenabled:1,
                            taxId:this.selectedTax,
                            modifiedon:new Date(new Date().getTime() - (new Date().getTimezoneOffset() * 60000)).toISOString(),
                            modifiedById:this.$store.state.userId

                        })
                            .then(res => {
                                //alert("Type Succesfully Edited and Saved")
                                //window.location=""
                                this.btnLoading=false
                                this.$emit('input', 2);
                            });

                }
            }

        },
        async getTaxProp(){
            await this.$axios.get("/"+this.$route.params.username+"/api/Configurations?access_token="+this.$store.state.token)
                        .then(res1 => {
                            for(let i=0;i<res1.data.length;i++){
                                if(res1.data[i].alias=="calculate_taxes_sales"){
                                    this.taxprop_s=res1.data[i].value
                                }
                                else if(res1.data[i].alias=="calculate_taxes_purchase") this.taxprop_p=res1.data[i].value
                            }
                            this.getTax()
                        });                   
        },
        async getTax(){
            if(this.taxprop_p==1 || this.taxprop_s==1){
                await this.$axios.get("/"+this.$route.params.username+"/api/Taxes?access_token="+this.$store.state.token+"&filter[where][isenabled]=1")
                    .then(res => {
                        this.taxes=res.data;                         
                    });
            }
            
        },
        async fillData()
        {
            await this.$axios.get("/"+this.$route.params.username+"/api/Types/"+this.id+"?access_token="+this.$store.state.token+"&filter[include]=tax")
                    .then(res => {
                        this.typeName=res.data.name;
                        this.selectedTax=res.data.tax.id;
                        //console.log(this.selectedTax)
                    });

        }
    }
}
</script>
