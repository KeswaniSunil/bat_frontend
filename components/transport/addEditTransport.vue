<template>
    <v-form @submit.prevent="addTransport" ref="form1" lazy-validation onkeypress="return event.keyCode != 13">
        <v-layout align-center justify-start row wrap class="mb-3">
                <v-flex xs12 sm12>
                    <label class="font-16 font-weight-regular " >Transport Name*</label>
                    <v-text-field label="" type=text  :rules="requiredRules" v-model="transportname" height=25 class="pa-0 mt-1"></v-text-field>
                </v-flex>
            </v-layout>
            <v-layout align-center justify-start row wrap class="mb-1">
                <v-flex xs12 sm12>
                    <label class="font-16 font-weight-regular">Vehicle No.*</label>
                    <v-text-field label="" type=text  :rules="requiredRules" v-model="vehicleno" height=25 class="pa-0 mt-1"></v-text-field>
                </v-flex>
            </v-layout>
            <v-layout align-center justify-start row wrap>
                <v-flex xs7 sm9></v-flex>
                <v-flex xs5 sm3>
                    <v-btn v-if="propCheck==0" class="" :loading="btnLoading" type="submit" color="info" round dark>
                        Add
                        <v-icon dark right class="ml-1">check_circle</v-icon>
                    </v-btn>
                    <v-btn v-else :loading="btnLoading" type="submit" color="info" round dark>
                        Save
                        <v-icon dark right class="ml-1">check_circle</v-icon>
        
                    </v-btn>
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
            this.propCheck=1
            this.getData()
        }
    },
    data(){
        return{
            transportname:"",
            vehicleno:"",
            propCheck:0,
            requiredRules: [
                v => !!v || 'This Field is required'
            ],
           biggerScreen:true,
           btnLoading:false
        }
    },
    methods:{
        async addTransport(){
            if (this.$refs.form1.validate())
            {   
                this.btnLoading=true
                if(this.propCheck==0){
                    await this.$axios.post("/"+this.$route.params.username+"/api/Transports?access_token="+this.$store.state.token,{
                            name:this.transportname,
                            isenabled:1,
                            vehicleno:this.vehicleno,
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
                    await this.$axios.post("/"+this.$route.params.username+"/api/Transports/update?access_token="+this.$store.state.token+"&where[id]="+this.id,{
                            name:this.transportname,
                            isenabled:1,
                            vehicleno:this.vehicleno,
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
        getData(){
            this.$axios.get("/"+this.$route.params.username+"/api/Transports/"+this.id+"?access_token="+this.$store.state.token)
            .then(res => {
                this.transportname=res.data.name;
                this.vehicleno=res.data.vehicleno;
            });
        }
    }
}
</script>
