<template>
    <v-form @submit.prevent="addUnit" ref="form1" lazy-validation onkeypress="return event.keyCode != 13">
        
            <v-layout align-center justify-start row wrap class="mb-3">
                <v-flex xs12 sm12>
                    <v-text-field label="Unit" type=text  :rules="requiredRules" v-model="unit" height=20 ></v-text-field>
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
    },
    data(){
        return{
            unit:"",
            propCheck:0,
            requiredRules: [
                v => !!v || 'This Field is required'
            ],
           btnLoading:false
        }
    },
    methods:{
        async addUnit(){
            if (this.$refs.form1.validate())
            {   
                this.btnLoading=true
                if(this.propCheck==0){
                    await this.$axios.post("/"+this.$route.params.username+"/api/Units?access_token="+this.$store.state.token,{
                                title:this.unit,
                                isenabled:1,
                            })
                            .then(res => {
                                //alert("Type Succesfully Added")
                                // window.location=""
                                this.btnLoading=false
                                this.$emit('input', 2);
                            });
                }
                else{
                    await this.$axios.post("/"+this.$route.params.username+"/api/Units/update?access_token="+this.$store.state.token+"&where[id]="+this.id,{
                                title:this.unit,
                                isenabled:1,
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
            await this.$axios.get("/"+this.$route.params.username+"/api/Units/"+this.id+"?access_token="+this.$store.state.token)
                    .then(res => {
                        this.unit=res.data.title;
                        //console.log(this.selectedTax)
                    });

        }
    }
}
</script>
