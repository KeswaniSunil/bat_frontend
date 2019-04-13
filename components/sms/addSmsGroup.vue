<template>
    <v-form @submit.prevent="addGroup" ref="form1" lazy-validation onkeypress="return event.keyCode != 13">
        
            <v-layout align-center justify-start row wrap class="mb-3">
                <v-flex xs12 sm12>
                    <v-text-field label="Group Name" type=text  :rules="requiredRules" v-model="groupName" ></v-text-field>
                </v-flex>
            </v-layout>
            <v-layout align-center justify-start row wrap>
                <v-flex xs12 sm12>
                    <v-layout align-start justify-end>
                    <v-btn v-if="propCheck==0" class="" :loading="btnLoading" type="submit" color="info" round dark >
                        Add
                        <v-icon dark right class="ml-1">check_circle</v-icon>
                    </v-btn>
                    <v-btn v-else class="" :loading="btnLoading" type="submit" color="info" round dark >
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
    },
    data(){
        return{
            groupName:"",
            propCheck:0,
            requiredRules: [
                v => !!v || 'This Field is required'
            ],
           biggerScreen:true,
           btnLoading:false
        }
    },
    methods:{
        async addGroup(){
            if (this.$refs.form1.validate())
            {   
                this.btnLoading=true
                if(this.propCheck==0){
                    await this.$axios.post("/"+this.$route.params.username+"/api/Smsgroups?access_token="+this.$store.state.token,{
                            name:this.groupName,
                            isenabled:1,
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
                    await this.$axios.post("/"+this.$route.params.username+"/api/Smsgroups/update?access_token="+this.$store.state.token+"&where[id]="+this.id,{
                            name:this.groupName,
                            isenabled:1,
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
        async fillData()
        {
            await this.$axios.get("/"+this.$route.params.username+"/api/Smsgroups/"+this.id+"?access_token="+this.$store.state.token)
                    .then(res => {
                        this.groupName=res.data.name;
                        //console.log(this.selectedTax)
                    });

        }
    }
}
</script>
