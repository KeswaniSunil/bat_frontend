<template>
    <v-form @submit.prevent="addGroup" ref="form1" lazy-validation onkeypress="return event.keyCode != 13">

        <v-layout align-center justify-start row wrap class="mb-3">
            <v-flex xs12 sm12>
                <v-autocomplete v-if="id == null || enable == 1" v-model="customerId" :items="customerACVitems" :rules="requiredRules"
                    append-icon="search" :loading="customerACV.isLoading" :search-input.sync="customerACV.search"
                    hide-no-data hide-selected item-text="name" item-value="id" label="Customer Name"
                    return-string @input="check"></v-autocomplete>

                <v-layout v-else align-start justify-start row wrap>
                    <v-flex xs10 sm10>
                        <v-text-field v-model="customerName"  disabled></v-text-field>
                    </v-flex>
                    <v-flex xs1 sm1></v-flex>
                    <v-flex xs1 sm1>
                        <v-icon color="red" @click="enable=1,customerId=''" class="pt-3">edit</v-icon>
                    </v-flex>
                </v-layout>
            </v-flex>
        </v-layout>
        <v-layout align-center justify-start row wrap>
            <v-flex xs12 sm12>
                <v-layout align-start justify-end>
                    <v-btn v-if="propCheck==0" class="" :loading="btnLoading" type="submit" color="info" round dark>
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
        props: {
            id: {
                type: String,
                required: false
            },
            gId:{
                type: String,
                required: false
            },
            value: {
                type: Number,
                required: false
            }
        },
        created() {
            if (this.id != null) {
                this.propCheck = 1,
                    this.fillData(),
                    this.enable = 0
            }
        },
        computed: {
            customerACVitems() {
                return this.customerACV.entries.map(entry => {
                    const name = entry.name.length > this.descriptionLimit
                        ? entry.name.slice(0, this.descriptionLimit) + '...'
                        : entry.name
                    const id = entry.id
                    return Object.assign({}, entry, { id, name })
                })
            }
        },
        watch: {
            'customerACV.search': function (val) {
                // Items have already been requested
                if (this.customerACV.isLoading) return
                this.customerACV.isLoading = true

                // Lazily load input items
                this.$axios.get('/' + this.$route.params.username + '/api/Customers?access_token=' + this.$store.state.token+"&filter[where][isenabled]=1")
                    .then(res => {
                        //let { values } = res.data
                        this.customerACV.entries = res.data
                    })
                    .catch(err => {
                        console.log(err)
                    })
                    .finally(() => (this.customerACV.isLoading = false))
            }
        },
        data() {
            return {
                customerId: "",
                customerName: "",
                propCheck: 0,
                requiredRules: [
                    v => !!v || 'This Field is required'
                ],
                biggerScreen: true,
                btnLoading: false,
                customerACV: {
                    isLoading: false,
                    search: null,
                    entries: []
                },
                enable: 1
            }
        },
        methods: {
            async addGroup() {
                if (this.$refs.form1.validate()) {
                    this.btnLoading = true
                    if (this.propCheck == 0) {
                        await this.$axios.post("/" + this.$route.params.username + "/api/Customergroups?access_token=" + this.$store.state.token, {
                            smsgroupId: this.gId,
                            customerId: this.customerId,
                            isenabled: 1,
                            createdon: new Date(new Date().getTime() - (new Date().getTimezoneOffset() * 60000)).toISOString(),
                            modifiedon: new Date(new Date().getTime() - (new Date().getTimezoneOffset() * 60000)).toISOString(),
                            createdById: this.$store.state.userId,
                            modifiedById: this.$store.state.userId

                        })
                            .then(res => {
                                //alert("Type Succesfully Added")
                                // window.location=""
                                this.btnLoading = false
                                this.$emit('input', 2);
                            });
                    }
                    else {
                        await this.$axios.post("/" + this.$route.params.username + "/api/Customergroups/update?access_token=" + this.$store.state.token + "&where[id]=" + this.id, {
                            smsgroupId: this.gId,
                            customerId: this.customerId,
                            isenabled: 1,
                            modifiedon: new Date(new Date().getTime() - (new Date().getTimezoneOffset() * 60000)).toISOString(),
                            modifiedById: this.$store.state.userId

                        })
                            .then(res => {
                                //alert("Type Succesfully Edited and Saved")
                                //window.location=""
                                this.btnLoading = false
                                this.$emit('input', 2);
                            });

                    }
                }

            },
            async fillData() {
                await this.$axios.get("/" + this.$route.params.username + "/api/CustomerGroups/" + this.id + "?access_token=" + this.$store.state.token + "&filter[include]=customer")
                    .then(res => {
                        this.customerName = res.data.customer.name;
                        
                    });

            },
            check(){
                this.$axios.get("/" + this.$route.params.username + "/api/Customergroups/count?access_token=" + this.$store.state.token+"&where[customerId]="+this.customerId+"&where[smsgroupId]="+this.gId)
                       .then(res=>{
                            if(res.data.count>0)
                                {
                                    this.$store.commit("snackbar/setSnack", "Already Exists.");            
                                    this.customerId="";
                                }
                                else{
                                    
                                }
                        })               
            }
        }
    }
</script>