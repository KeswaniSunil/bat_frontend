<template>
    <v-form @submit.prevent="submit" ref="form" lazy-validation onkeypress="return event.keyCode != 13">
        <v-layout justify-center align-center row wrap>
            <v-flex xs12 sm12>
                <v-autocomplete v-model="data1.id" :items="csACVitems" @input="getPendingAmount()"
                    :rules="requiredRules" append-icon="search" :loading="csACV.isLoading" :search-input.sync="csACV.search"
                    hide-no-data hide-selected item-text="name" item-value="id" :label="mode == 'customer'? 'Customer Name' : 'Supplier Name'"
                    return-string height=20 ></v-autocomplete>
            </v-flex>
            <v-flex xs12 sm12>
                <v-text-field type=number height=20 :rules="numberRules"
                    :label="mode == 'customer'? 'Received amount' : 'Paid amount'" v-model="data1.receive" @keyup="calculation()" @change="calculation()"></v-text-field>
            </v-flex>
            <v-flex xs12 sm12>
                <v-text-field type=number height=20 disabled
                    label="Pending amount" v-model="data1.pending"></v-text-field>
            </v-flex>
            <v-layout justify-end>
                <v-btn type=submit round color="info" :loading="loading">
                    Submit
                </v-btn>
            </v-layout>
        </v-layout>
    </v-form>
</template>

<script>
    export default {
        props: {
            mode: {
                type: String,
                required: true
            },
            value: {
                type: Number,
                required: false
            }
        },
        data:() => ({
                data1: {
                    id: "",
                    pending: 0,
                    receive: 0
                },
                loading:false,
                pending:0,
                biggerScreen:true,
                csACV: {
                    isLoading: false,
                    search: null,
                    entries: []
                },
                requiredRules:[
                    v => !!v || 'This Field is required'
                ],
                numberRules: [
                    v => !!v || 'This Field is required',
                    v => (v >= 0) || 'Value should be greater than 0'
                ],
            
        }),
        computed:{
            csACVitems() {
                return this.csACV.entries.map(entry => {
                    const name = entry.name.length > this.descriptionLimit
                        ? entry.name.slice(0, this.descriptionLimit) + '...'
                        : entry.name
                    const id = entry.id
                    return Object.assign({}, entry, { id, name })
                })
            }
        },
        watch:{
            'csACV.search': function (val) {
                // Items have already been requested
                if (this.csACV.isLoading) return
                this.csACV.isLoading = true

                // Lazily load input items
                if(this.mode == 'customer') {  
                    this.$axios.get('/' + this.$route.params.username + '/api/Customers?access_token=' + this.$store.state.token)
                    .then(res => {
                        //let { values } = res.data
                        this.csACV.entries = res.data
                    })
                    .catch(err => {
                        console.log(err)
                    })
                    .finally(() => (this.csACV.isLoading = false))
                }
                else if(this.mode == 'supplier') {  
                    this.$axios.get('/' + this.$route.params.username + '/api/Suppliers?access_token=' + this.$store.state.token )
                    .then(res => {
                        //let { values } = res.data
                        this.csACV.entries = res.data
                    })
                    .catch(err => {
                        console.log(err)
                    })
                    .finally(() => (this.csACV.isLoading = false))
                }
            }
        },
        methods: {
            submit(){
                if (this.$refs.form.validate()) {
                    this.loading = true
                    if(this.mode == 'customer')
                    {
                        this.$axios.post("/"+this.$route.params.username+"/api/Customers/settlement?access_token="+this.$store.state.token,{
                            customerId:this.data1.id,
                            amount:this.data1.receive,
                            pending:this.data1.pending,
                            userId:this.$store.state.userId
                        })
                        .then(res=>{
                            //console.log("res")
                            this.$emit("input", 2);
                        })
                    }
                    else {
                        this.$axios.post("/"+this.$route.params.username+"/api/Suppliers/settlement?access_token="+this.$store.state.token,{
                            supplierId:this.data1.id,
                            amount:this.data1.receive,
                            pending:this.data1.pending,
                            userId:this.$store.state.userId
                        })
                        .then(res=>{
                            //console.log("res")
                            this.$emit("input", 2);
                        })
                    }
                }
            },
            getPendingAmount(){
                if(this.mode == 'customer')
                {
                    this.$axios.get("/"+this.$route.params.username+"/api/Customers/"+this.data1.id+"?access_token="+this.$store.state.token)
                    .then(res=>{
                        this.data1.pending = parseFloat(res.data.totalamount) - parseFloat(res.data.received)
                        this.pending = this.data1.pending
                    })
                }
                else if(this.mode == 'supplier')
                {
                    this.$axios.get("/"+this.$route.params.username+"/api/Suppliers/"+this.data1.id+"?access_token="+this.$store.state.token)
                    .then(res=>{
                        this.data1.pending = parseFloat(res.data.totalamount) - parseFloat(res.data.paid)
                        this.pending = this.data1.pending
                    })
                }
            },
            calculation(){
                if(this.data1.receive >= 0)
                    this.data1.pending = this.pending - this.data1.receive 
            }
        }
    }
</script>