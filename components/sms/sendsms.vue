<template>
    <div>
        <v-form @submit.prevent="sendsms()" ref="form1" lazy-validation onkeypress="return event.keyCode != 13">
            <v-layout row wrap justify-center align-center class="ma-3">
                <v-flex xs12 sm12>
                    <v-select :items="['Group','Individual']" :rules="requiredRules" label="Select Group/Individual:" v-model="gori"></v-select>
                </v-flex>
                <v-flex xs12 sm12 v-if="gori == 'Group'">
                    <v-select :items="groupitem" item-text="name" :rules="requiredRules" item-value="id" label="Select Group:" v-model="groupname"></v-select>
                </v-flex>
                <v-flex xs12 sm12>
                    <v-autocomplete
                        v-model="customer"
                        :items="customerACVitems"
                        hide-no-data hide-selected item-text="name" item-value="id"
                        :loading="customerACV.isLoading" :search-input.sync="customerACV.search"
                        label="Select Customer" return-object
                        multiple :rules="requiredRules"
                        >
                        <template v-slot:selection="data">
                            <v-chip
                            :selected="data.selected"
                            close
                            class="chip--select-multi"
                            @input="removeCustomer(data.item)"
                            >
                            {{ data.item.name }}
                            </v-chip>
                        </template>
                    </v-autocomplete>
                </v-flex>
                <v-flex xs12 sm12 v-if="gori == 'df'">
                    <v-autocomplete
                        v-model="supplier"
                        :items="supplierACVitems"
                        hide-no-data hide-selected item-text="name" item-value="id"
                        :loading="supplierACV.isLoading" :search-input.sync="supplierACV.search"
                        label="Select Supplier"
                        multiple
                        >
                        <template v-slot:selection="data">
                            <v-chip
                            :selected="data.selected"
                            close
                            class="chip--select-multi"
                            @input="removeSupplier(data.item)"
                            >
                            {{ data.item.name }}
                            </v-chip>
                        </template>
                    </v-autocomplete>
                </v-flex>
                <v-flex xs12 sm12>
                    <v-select :rules="requiredRules" :items="templateitems" @change="getContent()" label="Select Template:" item-text="title" item-value="id"   v-model="template"></v-select>
                </v-flex>
                <v-flex xs12 sm12>
                    <v-textarea :rules="requiredRules" label="Message" v-model="content"></v-textarea>
                </v-flex>
                <v-flex xs12 sm12>
                    <label class="font-14 font-weight-bold">
                        Notes:<br>
                        1.For Customer/Supplier Name use {name}
                        <br>
                        2.For Pending Amount use {pending}
                    </label>
                </v-flex>
                <v-layout justify-end>
                    <v-btn type=submit :loading="loading" round class="info">Send</v-btn>
                </v-layout>
            </v-layout>
        </v-form>
    </div>
</template>
<script>
export default {
    props:{
        value:{
            type:Number,
            required:false
        }
    },
    data(){
        return{
            gori:'Individual',
            template:null,
            templateitems:[],
            content:"",
            customerACV: {
                isLoading: false,
                search: null,
                entries: []
            },
            supplierACV: {
                isLoading: false,
                search: null,
                entries: []
            },
            requiredRules: [
                v => !!v || 'This Field is required'
            ],
            customer:[],
            supplier:[],
            groupitem:[],
            groupname:null,
            loading:false,
            valid:false
        }
    },
    computed:{
        customerACVitems() {
            return this.customerACV.entries.map(entry => {
                const name = entry.name.length > this.descriptionLimit
                    ? entry.name.slice(0, this.descriptionLimit) + '...'
                    : entry.name
                const id = entry.id
                return Object.assign({}, entry, { id, name })
            })
        },
        supplierACVitems() {
            return this.supplierACV.entries.map(entry => {
                const name = entry.name.length > this.descriptionLimit
                    ? entry.name.slice(0, this.descriptionLimit) + '...'
                    : entry.name
                const id = entry.id
                return Object.assign({}, entry, { id, name })
            })
        }
    },
    watch:{
        gori:{
            handler(){
                if(this.gori == 'Group'){
                    this.$axios.get('/' + this.$route.params.username + '/api/smsgroups?access_token=' + this.$store.state.token+"&filter[where][isenabled]=1")
                    .then(res=>{
                        this.groupitem = res.data
                    })
                }
            }
        },
        groupname:{
            handler(){
                this.customer =[]
                this.$axios.get('/' + this.$route.params.username + '/api/customergroups?access_token=' + this.$store.state.token+"&filter[include]=customer&filter[where][smsgroupId]="+this.groupname+"&filter[where][isenabled]=1")
                .then(res=>{ 
                    for(let i=0;i<res.data.length;i++)
                    {
                        this.customer.push(res.data[i].customer)
                    }
                    this.customerACV.search ="j"
                })
            }
        },
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
        },
        'supplierACV.search': function (val) {
            // Items have already been requested
            if (this.supplierACV.isLoading) return
            this.supplierACV.isLoading = true

            // Lazily load input items
            this.$axios.get('/' + this.$route.params.username + '/api/Suppliers?access_token=' + this.$store.state.token+"&filter[where][isenabled]=1")
                .then(res => {
                    //let { values } = res.data
                    this.supplierACV.entries = res.data
                })
                .catch(err => {
                    console.log(err)
                })
                .finally(() => (this.supplierACV.isLoading = false))
        }
    },
    created(){
        this.getDetails()
    },
    methods:{
        getDetails(){
            this.$axios.get("/"+this.$route.params.username+"/api/Smstemplates?access_token="+this.$store.state.token+"&filter[where][isenabled]=1")
            .then(res=>{
                this.templateitems = res.data
            })
        },
        getContent(){
            let $this = this
            let q = this.templateitems.find(function(c){
              return c.id == $this.template
            })
            this.content = q.content
        },
        removeCustomer (item) {
            let $this = this
            const index = (function(){
                for(let i=0;i<$this.customer.length;i++){
                    if($this.customer[i].id == item.id) return i
                }
            })();
            if (index >= 0) this.customer.splice(index, 1)
        },
        removeSupplier (item) {
            let $this = this
            const index = (function(){
                for(let i=0;i<$this.supplier.length;i++){
                    if($this.supplier[i].id == item.id) return i
                }
            })();
            if (index >= 0) this.supplier.splice(index, 1)
        },
        sendsms(){
            if (this.$refs.form1.validate()) {
                if(this.customer.length > 0) {
                    let data = []
                    this.loading = true
                    for(let i=0;i<this.customer.length;i++)
                    {
                        let s1 = this.content
                        let pending = this.customer[i].totalamount - this.customer[i].received
                        s1 = s1.replace(/{name}/g,new String(this.customer[i].name).toUpperCase())
                        s1 = s1.replace(/{pending}/g,pending)
                        data.push({smstemplateId:this.template,
                                    content:s1,
                                    smsgroupId:this.groupname,
                                    customerId:this.customer[i].id,
                                    datetime:new Date(new Date().getTime() - (new Date().getTimezoneOffset() * 60000)).toISOString(),
                                    createdon:new Date(new Date().getTime() - (new Date().getTimezoneOffset() * 60000)).toISOString(),
                                    createdById:this.$store.state.userId
                                })
                    }
                    this.$axios.post('/' + this.$route.params.username + '/api/smslogs/sendsms?access_token=' + this.$store.state.token,{data:data})
                    .then(res=>{
                        for(let i=res.data.notsend.length-1 ;i>=0;i--) {
                            data.splice(res.data.notsend[i],1)
                        } 
                        this.$axios.post('/' + this.$route.params.username + '/api/smslogs?access_token=' + this.$store.state.token,data)
                        .then(res=>{
                            this.$store.commit("snackbar/setSnack", "SMS Send!");
                            this.$emit('input',2)
                        })
                    })
                }
                else {
                    this.$store.commit("snackbar/setSnack", "No Customer Selected!");
                }
            }
        }
    }
}
</script>