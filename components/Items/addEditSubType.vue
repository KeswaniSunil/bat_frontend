<template>
    <v-form @submit.prevent="addSubType" ref="form1" lazy-validation onkeypress="return event.keyCode != 13">
        <v-layout align-center justify-start row wrap>
                <v-flex sm12>
                    <v-layout align-center justify-start row wrap>
                        <v-flex v-if="biggerScreen" xs12 sm2 class="text-lg-left">
                            <label class="font-15 font-weight-regular">SubType: </label>
                        </v-flex>
                        <v-flex xs12 sm4>
                            <v-text-field label="" type=text :single-line="biggerScreen" :rules="requiredRules" v-model="subTypeName" class="pa-0 ma-0"></v-text-field>
                        </v-flex>
                        <v-flex sm1></v-flex>
                        <v-flex xs12 sm1>Type</v-flex>
                        <v-flex xs12 sm4>
                            <v-autocomplete v-if="id == null" v-model="typeId" :items="typeListitems"
                                                :rules="requiredRules" auto-select-first clearable append-icon="search"
                                                :loading="typeList.isLoading" :search-input.sync="typeList.search"
                                                hide-no-data hide-selected item-text="name" item-value="id" label=""
                                                placeholder="" return-string height=20 :single-line="biggerScreen">
                    </v-autocomplete>
                    <v-text-field v-else v-model="typeName" height=20 disabled></v-text-field>
                        </v-flex>
                    </v-layout>    
                </v-flex>    
                <v-flex sm12>
                                        <v-layout text-xs-right row wrap>
                                            <v-flex xs8 sm10></v-flex>
                                            <v-flex xs4 sm2>
                                                <v-btn v-if="propCheck==0" class="" :loading="btnLoading" type="submit" color="info" round dark @click="">
                                                    Add
                                                    <v-icon dark right class="ml-1">check_circle</v-icon>
                                                </v-btn>
                                                <v-btn v-else class="" :loading="btnLoading" type="submit" color="info" round dark @click="">
                                                    Save
                                                    <v-icon dark right class="ml-1">check_circle</v-icon>
                                                    
                                                </v-btn>
                                            </v-flex>
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
    components:{
    },
    created(){
        if(this.id != null)
        {
            this.propCheck=1,
            this.fillData()
        }
    },
    updated(){
        if(this.modalType == 2) this.modalType=0 
    },
    watch: {
            'typeList.search': function (val) {
                // Items have already been requested
                if (this.typeList.isLoading) return
                this.typeList.isLoading = true

                // Lazily load input items
                this.$axios.get('/' + this.$route.params.username + '/api/Types/typeNames?access_token='+this.$store.state.token+'&names=' + val)
                    .then(res => {
                        let { values } = res.data
                        this.typeList.entries = values
                        
                    })
                    .catch(err => {
                        //console.log(err)
                    })
                    .finally(() => (this.typeList.isLoading = false))
            }
    },
    computed: {
            typeListitems() {
                return this.typeList.entries.map(entry => {
                    const name = entry.name.length > this.descriptionLimit
                        ? entry.name.slice(0, this.descriptionLimit) + '...'
                        : entry.name
                    const id = entry.id
                    return Object.assign({}, entry, { id, name })
                })
            }
    },                
    data(){
        return{
            url:process.env.URL,
            modalType:0,
            subTypeName:"",
            typeId:"",
            typeName:"",
            propCheck:0,
            editMode:{
                type:0
            },
            typeList: {
                        isLoading: false,
                        search: null,
                        entries: []
                },
            requiredRules: [
                v => !!v || 'This Field is required'
            ],
           biggerScreen:true,
           btnLoading:false
        }
    },
    methods:{
       
        async addSubType(){
            if(this.propCheck==0){
                await this.$axios.post("/"+this.$route.params.username+"/api/Subtypes?access_token="+this.$store.state.token,{
                        name:this.subTypeName,
                        isenabled:1,
                        typeId:this.typeId,
                        createdon:new Date(new Date().getTime() - (new Date().getTimezoneOffset() * 60000)).toISOString(),
                        modifiedon:new Date(new Date().getTime() - (new Date().getTimezoneOffset() * 60000)).toISOString(),
                        createdById:this.$store.state.userId,
                        modifiedById:this.$store.state.userId

                    })
                        .then(res => {
                            //alert("Subtype Succesfully Added")
                            //window.location=""
                            this.$emit('input', 2);
                        });
            }
            else{
                await this.$axios.post("/"+this.$route.params.username+"/api/Subtypes/update?access_token="+this.$store.state.token+"&where[id]="+this.id,{
                        name:this.subTypeName,
                        isenabled:1,
                        typeId:this.typeId,
                        modifiedon:new Date(),
                        modifiedById:this.$store.state.userId

                    })
                        .then(res => {
                           //alert("Subtype Succesfully Edited and Saved")
                           //window.location=""
                           this.$emit('input', 2);
                        });

            }

        },
        async fillData()
        {
            await this.$axios.get("/"+this.$route.params.username+"/api/Subtypes/"+this.id+"?access_token="+this.$store.state.token+"&filter[include]=type")
                    .then(res => {
                        this.subTypeName=res.data.name;
                        this.typeName=res.data.type.name;
                        this.typeId=res.data.typeId;
                    });

        }
    }
}
</script>