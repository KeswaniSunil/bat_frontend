<template>
    <v-layout>
        <v-flex sm12>
            <v-card flat class="border-radius-5">
                <v-card-text>
                    <v-layout class="pt-3" align-center justify-start row wrap>
                                        <v-flex xs12 sm4>
                                            <v-dialog ref="startdate" v-model="startDatemodal" :return-value.sync="startDate1"
                                                persistent lazy full-width width="290px">
                                                <template v-slot:activator="{ on }">
                                                    <v-text-field v-model="startDate1" label="Start Date" prepend-icon="event"
                                                        readonly v-on="on"></v-text-field>
                                                </template>
                                                <v-date-picker v-model="startDate1" scrollable>
                                                    <v-spacer></v-spacer>
                                                    <v-btn flat color="primary" @click="startDatemodal = false">Cancel</v-btn>
                                                    <v-btn flat color="primary" @click="$refs.startdate.save(startDate1)">OK</v-btn>
                                                </v-date-picker>
                                            </v-dialog>
                                        </v-flex>
                                        <v-flex sm1></v-flex>
                                        <v-flex xs12 sm4>
                                            <v-dialog ref="enddate" v-model="endDatemodal" :return-value.sync="endDate1"
                                                persistent lazy full-width width="290px">
                                                <template v-slot:activator="{ on }">
                                                    <v-text-field v-model="endDate1" label="End Date" prepend-icon="event"
                                                        readonly v-on="on"></v-text-field>
                                                </template>
                                                <v-date-picker v-model="endDate1" scrollable>
                                                    <v-spacer></v-spacer>
                                                    <v-btn flat color="primary" @click="endDatemodal = false">Cancel</v-btn>
                                                    <v-btn flat color="primary" @click="$refs.enddate.save(endDate1)">OK</v-btn>
                                                </v-date-picker>
                                            </v-dialog>
                                        </v-flex>
                                        <v-flex xs12 sm3>
                                            <v-layout row wrap>
                                                <v-flex xs7 sm3>
                                                </v-flex>
                                                <v-flex xs5 sm9>
                                                    <v-btn class="" dark round @click="getTotal()">Get Stock</v-btn>
                                                </v-flex>
                                            </v-layout>
                                        </v-flex>
                                    </v-layout>
                                    <v-data-table flat v-if="mode=='total'" :headers="header" :items="totalStock"
                                        :pagination.sync="pagination" :total-items="totalCount" :loading="loading"
                                        select-all item-key="id" class="elevation-1">
                                        <template v-slot:headers="props">
                                            <tr>
                                                <th v-for="header in props.headers" :key="header.text" :class="['column sortable', pagination.descending ? 'desc' : 'asc', header.value === pagination.sortBy ? 'active' : '']"
                                                    @click="changeSort(header.value)" style="text-align:left;">

                                                    {{ header.text }}<v-icon small>arrow_upward</v-icon>
                                                </th>
                                            </tr>
                                        </template>
                                        <template v-slot:no-data>
                                            <v-alert :value="true" color="error" icon="warning">
                                                Sorry, nothing to display here :(
                                            </v-alert>
                                        </template>
                                        <template v-slot:items="props">
                                            <tr class="text-xs-left">
                                                

                                            </tr>
                                        </template>
                                        <v-alert v-slot:no-results :value="true" color="error" icon="warning">
                                            Your search for "{{ search }}" found no results.
                                        </v-alert>
                                    </v-data-table>
                                    <v-data-table v-else :headers="header2" :items="totalStock"
                                        :pagination.sync="pagination" :total-items="totalCount" :loading="loading"
                                        select-all item-key="id" class="elevation-1">
                                        <template v-slot:headers="props">
                                            <tr>
                                                <th v-for="header in props.headers" :key="header.text" :class="['column sortable', pagination.descending ? 'desc' : 'asc', header.value === pagination.sortBy ? 'active' : '']"
                                                    @click="changeSort(header.value)" style="text-align:left;">

                                                    {{ header.text }}<v-icon small>arrow_upward</v-icon>
                                                </th>
                                            </tr>
                                        </template>
                                        <template v-slot:no-data>
                                            <v-alert :value="true" color="error" icon="warning">
                                                Sorry, nothing to display here :(
                                            </v-alert>
                                        </template>
                                        <template v-slot:items="props">
                                            <tr >

                                                <td width="6%">{{props.item.index+1}}</td>
                                                <td>{{ props.item.item.name }}</td>
                                                <td>{{ props.item.price }}</td>
                                                <td>{{ props.item.quantity }}</td>
                                                <td v-if="billNo_purchase[props.index] != null">{{
                                                    billNo_purchase[props.index] }}</td>
                                                <td v-else-if="billNo_order[props.index] != null">{{
                                                    billNo_order[props.index] }}</td>
                                                <td v-else>-</td>
                                                <td>{{ changeToIST(props.item.date) }}</td>
                                                <th>{{props.item.notes}}</th>
                                            </tr>
                                        </template>
                                        <v-alert v-slot:no-results :value="true" color="error" icon="warning">
                                            Your search for "{{ search }}" found no results.
                                        </v-alert>
                                    </v-data-table>

                </v-card-text>
            </v-card>    
        </v-flex>
    </v-layout>            
</template>

<script>
    export default {
        props: {
            mode: {
                type: String,
                required: true
            }
        },
        data() {
            return {
                header: [{
                    text: '#',
                    align: 'left',
                    sortable: false,
                    value: 'name'
                },
                { text: 'Bill No.', value: 'billno' },
                { text: 'Date', value: 'date' },
                { text: 'Name', value: 'name' },
                { text: 'Quantity', value: 'quantity' },
                { text: 'Price', value: 'price' },
                { text: 'Notes', value: 'notes' }],
                header2: [{
                    text: '#',
                    align: 'left',
                    sortable: false,
                    value: 'name'
                },
                { text: 'Bill No.', value: 'billno' },
                { text: 'Date', value: 'date' },
                { text: 'Customer Name', value: 'customername' },
                { text: 'Quantity', value: 'quantity' },
                { text: 'Price', value: 'price' }],
                newIndex: 0,
                totalStock_p: [],
                totalStock:[],
                totalStock_e: [],
                loading: true,
                pagination: {},
                usedStock: [],
                billno_order: [],
                billno_purchase: [],
                startDate1: null,
                endDate1: null,
                startDatemodal: false,
                endDatemodal: false,
                totalCount:0
            }
        },
        created() {
            this.generate()

        },
        watch: {
            pagination: {
                handler() {
                    if(this.mode=="total"){
                        this.getDataFromApi()
                        .then(data => {
                            this.totalStock = data.items
                            this.totalCount = data.total
                            
                        })
                    }
                    else{
                        this.getDataFromApi()
                        .then(data => {
                            
                            this.usedStock = data.items
                            this.totalCount = data.total
                        })
                    }
                },
                deep: true
            },
            search: {
                handler() {
                    if(this.mode=="total"){
                        this.getDataFromApi()
                        .then(data => {
                            
                            this.totalStock = data.items
                            this.totalCount = data.total
                        })
                    }
                    else{
                        this.getDataFromApi()
                        .then(data => {
                            
                            this.usedStock = data.items
                            this.totalCount = data.total
                        })
                    }
                }
            }
        },
        mounted() {
            if(this.mode=="total"){
                        this.getDataFromApi()
                        .then(data => {
                            
                            this.totalStock = data.items
                            this.totalCount = data.total
                        })
                    }
                    else{
                        this.getDataFromApi()
                        .then(data => {
                            
                            this.usedStock = data.items
                            this.totalCount = data.total
                        })
                    }
        },
        
        methods: {
            toggleAll() {
                if (this.selectType.length) this.selectType = []
                else this.selectType = this.typeDtl.slice()
            },
            changeSort(column) {
                if (this.pagination.sortBy === column) {
                    this.pagination.descending = !this.pagination.descending
                } else {
                    this.pagination.sortBy = column
                    this.pagination.descending = false
                }
            },
            getDataFromApi() {
                this.loading = true
                return new Promise((resolve, reject) => {
                    const { sortBy, descending, page, rowsPerPage } = this.pagination
                    //console.log("aa")
                    let items = [];
                    if(this.mode=='total'){
                        // this.$axios.get("/" + this.$route.params.username + "/api/Purchaseitems?access_token=" + this.$store.state.token + "&filter[where][itemId]=" + this.$route.params.stockListing + "&filter[include][purchase]=supplier")
                        // .then(res => {
                        //     this.$axios.get("/" + this.$route.params.username + "/api/Stocklogs?access_token=" + this.$store.state.token + "&filter[where][itemId]=" + this.$route.params.stockListing + "&filter[where][isenabled]=1")
                        //         .then(res1 => {
                        //             items = []
                        //             let promise1 = new Promise((resolve1, reject) => {
                        //                 for (let i = 0; i < res.data.length; i++) {
                        //                     if (new Date(res.data[i].purchase.billdate) >= new Date(this.startDate1) && new Date(res.data[i].purchase.billdate) <= new Date(this.endDate1)) {
                        //                         this.totalStock_p.push(res.data[i]);
                        //                     }
                        //                 }
                        //                 resolve1();
                        //             });
                        //             promise1.then((resolve1) => {
                        //                 for (let j = 0; j < res1.data.length; j++) {
                        //                     if (new Date(res1.data[j].date) >= new Date(this.startDate1) && new Date(res1.data[j].date) <= new Date(this.endDate1) && res1.data[j].purchaseId == null && res1.data[j].orderId == null) {
                        //                         this.totalStock_e.push(res1.data[j]);

                        //                     }
                        //                 }
                        //                 items =this.totalStock_p.concat(this.totalStock_e) ;
                        //                 //console.log("cc")
                        //                 const total = items.length
                        //                 console.log(total)
                        //                 this.loading = false
                        //                 resolve({
                        //                     items,
                        //                     total
                        //                 })
                        //             });
                        //         });
                        // });   
                        this.$axios.get('/' + this.$route.params.username + '/api/Stocklogs/getTotalStock?access_token=' + this.$store.state.token + '&filter={"skip":"'+parseInt(rowsPerPage * (page-1))+'","limit":"'+rowsPerPage+'","startdate":"'+this.startDate1+'","enddate":"'+this.endDate1+'","id":"'+this.$route.params.stockListing+'","search":"'+this.search+'","sort":"'+sortBy+'","descending":"'+descending+'"}')
                        .then(res => {
                            console.log(res.data.total)
                            items = res.data.data;
                            //console.log("cc")
                            const total = res.data.total
                            this.loading = false
                            resolve({
                                items,
                                total
                            })
                        });
                    }
                    else{
                        this.$axios.get("/" + this.$route.params.username + "/api/Orderitems?access_token=" + this.$store.state.token + "&filter[where][itemId]=" + this.$route.params.stockListing + "&filter[include][order]=customer")
                        .then(res => {
                            items = []
                            for (let i = 0; i < res.data.length; i++) {
                                if (new Date(res.data[i].order.billdate) >= new Date(this.startDate1) && new Date(res.data[i].order.billdate) <= new Date(this.endDate1)) {
                                    items.push(res.data[i]);
                                }
                            }
                            //console.log("bb")
                            items = res.data;
                            //console.log("cc")
                            const total = res.data.length
                            this.loading = false
                            resolve({
                                items,
                                total
                            })
                        });
                    }
                    
                })
            },
            changeToIST(date) {
                let rs = new Date(date)
                let dt = rs.getDate();
                let mn = rs.getMonth() + 1
                if (dt < 10) dt = '0' + dt;
                if (mn < 10) mn = '0' + mn
                let str = dt + "-" + mn + "-" + rs.getFullYear();
                return str
            },
            async generate() {
                let date = new Date();
                let month = date.getMonth();
                let year = date.getFullYear();
                let date1 = "" + new Date(year, month + 1, 0).getDate();
                let date2 = "" + new Date(year, month, 1).getDate();
                if ((date.getMonth() + 1) < 10) month = "0" + (date.getMonth() + 1)
                if (date2 < 10) date2 = "0" + date2;
                this.startDate1 = year + "-" + month + "-" + date2;
                this.endDate1 = year + "-" + month + "-" + date1;
                this.getTotal()

            },
            async getTotal() {
                if(this.mode=="total"){
                        this.getDataFromApi()
                        .then(data => {
                            
                            this.totalStock = data.items
                            this.totalCount = data.total
                            //console.log(this.totalStock)
                        })
                    }
                    else{
                        this.getDataFromApi()
                        .then(data => {
                            
                            this.usedStock = data.items
                            this.totalCount = data.total
                        })
                    }
            },

        }

    }
</script>

<style>

</style>