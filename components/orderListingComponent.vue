<template>
    <v-layout>
        <v-flex id="section-to-print" xs12 sm12>
            <div v-if="clickPrint == 1">
                <div class="pagebreak" v-for="(id,index) in selectOrder" :key="index">
                    <Receipt :id="id.id" v-model="printOrderList[index]" :noofbill="1" :multiple="true" />
                </div>
            </div>
            <div v-else-if="printid != '' ">
                <Receipt :id="printid" v-model="printid" :onlyprint="true" :noofbill="2" />
            </div>
            <v-card v-else class="border-radius-5">
                <v-card-text class="pt-0">
                    <v-layout class="pt-3" align-center justify-start row wrap>
                        <v-flex xs12 sm4>
                            <v-dialog ref="startdate" v-model="startDatemodal" :return-value.sync="startDate1"
                                persistent lazy full-width width="290px">
                                <template v-slot:activator="{ on }">
                                    <v-text-field v-model="startDate1" label="Start Date" prepend-icon="event" readonly
                                        v-on="on"></v-text-field>
                                </template>
                                <v-date-picker v-model="startDate1" :max="endDate1" scrollable>
                                    <v-spacer></v-spacer>
                                    <v-btn flat color="primary" @click="startDatemodal = false">Cancel</v-btn>
                                    <v-btn flat color="primary" @click="$refs.startdate.save(startDate1)">OK</v-btn>
                                </v-date-picker>
                            </v-dialog>
                        </v-flex>
                        <v-flex sm1></v-flex>
                        <v-flex xs12 sm4>
                            <v-dialog ref="enddate" v-model="endDatemodal" :return-value.sync="endDate1" persistent
                                lazy full-width width="290px">
                                <template v-slot:activator="{ on }">
                                    <v-text-field v-model="endDate1" label="End Date" prepend-icon="event" readonly
                                        v-on="on"></v-text-field>
                                </template>
                                <v-date-picker v-model="endDate1" scrollable>
                                    <v-spacer></v-spacer>
                                    <v-btn flat color="primary" @click="endDatemodal = false">Cancel</v-btn>
                                    <v-btn flat color="primary" @click="$refs.enddate.save(endDate1)">OK</v-btn>
                                </v-date-picker>
                            </v-dialog>
                        </v-flex>
                        <v-flex xs12 sm3>
                            <v-btn class="" dark round @click="getOrders()">Get Orders</v-btn>
                        </v-flex>
                    </v-layout>
                    <v-layout column>
                        <v-flex xs12>
                            <v-layout align-center row wrap>
                                <v-flex xs3 sm2>
                                    <v-layout align-center justify-space-between>
                                        <v-btn v-if="selectOrder.length > 0" color="error" round class="pa-0" @click="deleteCustomer">
                                            <v-icon dark small class="mr-1">delete</v-icon> Delete
                                        </v-btn>
                                        <v-btn v-if="selectOrder.length > 0 && (mode == 'sale' || mode == 'customer') " round color="blue" @click="printOrder" dark>
                                            <v-icon dark small class="mr-1">print</v-icon> Print
                                        </v-btn>
                                    </v-layout>
                                </v-flex>
                                <v-flex xs9 sm10></v-flex>
                            </v-layout>
                        </v-flex>
                    </v-layout>
                    <v-card class="elevation-3 mt-2" style="border-radius:5px;">
                        <v-card-title v-if="mode=='sale' || mode == 'customer'"  class="pa-2 primary white--text">
                            List of All Sale's Orders:-
                        </v-card-title>
                        <v-card-title v-else class="pa-2 primary white--text">
                            List of All Purchase's Orders:-
                        </v-card-title>
                        <v-card-text>
                            <v-layout row wrap >
                                <v-flex xs12 sm9 class="mb-3">
                                    <v-layout align-start justify-start row wrap>
                                        
                                        <v-btn color="primary" round class="pa-0 mr-1" :loading="loadingPDF" @click="_export('pdf')">
                                        <v-icon dark small class="mr-2"  reverse>cloud_download</v-icon>Pdf
                                    </v-btn>
                                    <v-btn color="primary" round  class="pa-0 " :loading="loadingExcel" @click="_export('excel')">
                                                <v-icon dark small class="mr-2"  reverse>cloud_download</v-icon>Excel   
                                            </v-btn>
                                            
                                    </v-layout>    
                                </v-flex>
                                <v-flex xs12 sm3 class="mb-3">
                                    <v-text-field v-model="search" append-icon="search" label="Search" class="pa-0 ma-0" single-line hide-details></v-text-field>
                                </v-flex>
                            
                            </v-layout>
                    <v-data-table v-if="mode == 'sale' || mode == 'purchase'" v-model="selectOrder" :headers="header" :items="orderDtl" :pagination.sync="pagination"
                        :total-items="totalCustomer" :loading="loading" select-all item-key="id" class="elevation-0">
                        <template v-slot:headers="props">
                            <tr>
                                <th>
                                    <v-checkbox :input-value="props.all" :indeterminate="props.indeterminate" primary
                                        hide-details @click.stop="toggleAll"></v-checkbox>
                                </th>
                                <th v-for="header in props.headers" :key="header.text" :class="['column sortable', pagination.descending ? 'desc' : 'asc', header.value === pagination.sortBy ? 'active' : '']"
                                    @click="changeSort(header.value)">
                                    <v-icon small>arrow_upward</v-icon>
                                    {{ header.text }}
                                </th>
                                <th v-if="mode == 'sale' || mode == 'customer'">Print</th>
                            </tr>
                        </template>
                        <template v-slot:items="props">
                            <tr>
                                <td :active="props.selected" @click="props.selected = !props.selected">
                                    <v-checkbox :input-value="props.selected" primary hide-details></v-checkbox>
                                </td>
                                <td>{{props.item.index+1}}</td>
                                <td>
                                    {{ new Date(props.item.billdate).getDate()+"/"+(new Date(props.item.billdate).getMonth()+1)+"/"+new Date(props.item.billdate).getFullYear() }}
                                </td>
                                <td v-if="mode == 'purchase'">
                                    <router-link class="text-uppercase" :to="'/'+$route.params.username+'/Dashboard/purchase/order/'+props.item.id+'/view'">{{
                                        props.item.billno }}</router-link>
                                </td>
                                <td v-else-if="mode == 'sale'">
                                    <router-link class="text-uppercase" :to="'/'+$route.params.username+'/Dashboard/sales/order/'+props.item.id+'/view'">{{props.item.billbook.prefix+""+props.item.billno
                                        }}</router-link>
                                </td>
                                <td v-if="mode == 'purchase'">
                                    <router-link class="text-capitalize" :to="'/'+$route.params.username+'/Dashboard/purchase/supplier/'+props.item.supplier.id+'/view'">{{props.item.supplier.name}}</router-link>
                                </td>
                                <td v-else-if="mode == 'sale'">
                                    <router-link class="text-capitalize" :to="'/'+$route.params.username+'/Dashboard/sales/customer/'+props.item.customer.id+'/view'">{{props.item.customer.name}}</router-link>
                                </td>
                                <td>{{ props.item.totalamount }}</td>
                                <td v-if="mode == 'purchase'">
                                    <v-btn :to="'/'+$route.params.username+'/Dashboard/purchase/order/'+props.item.id+'/edit'" icon>
                                        <v-icon>edit</v-icon>
                                    </v-btn>
                                </td>
                                <td v-else-if="mode == 'sale'">
                                    <v-btn :to="'/'+$route.params.username+'/Dashboard/sales/order/'+props.item.id+'/edit'" icon>
                                        <v-icon class="grey--text text--darken-2">edit</v-icon>
                                    </v-btn>
                                </td>
                                <td v-if="mode == 'sale'">
                                    <v-btn icon @click="print(props.item.id)"><v-icon class="grey--text text--darken-2">print</v-icon></v-btn>
                                </td>
                            </tr>
                        </template>
                    </v-data-table>
                    <v-data-table v-else v-model="selectOrder" :headers="header2" :items="orderDtl" :pagination.sync="pagination"
                        :total-items="totalCustomer" :loading="loading" select-all item-key="id" class="elevation-0">
                        <template v-slot:headers="props">
                            <tr>
                                <th>
                                    <v-checkbox :input-value="props.all" :indeterminate="props.indeterminate" primary
                                        hide-details @click.stop="toggleAll"></v-checkbox>
                                </th>
                                <th v-for="header in props.headers" :key="header.text" :class="['column sortable', pagination.descending ? 'desc' : 'asc', header.value === pagination.sortBy ? 'active' : '']"
                                    @click="changeSort(header.value)">
                                    <v-icon small>arrow_upward</v-icon>
                                    {{ header.text }}
                                </th>
                                <th v-if="mode == 'sale' || mode == 'customer'">Print</th>
                            </tr>
                        </template>
                        <template v-slot:items="props">
                            <tr>
                                <td :active="props.selected" @click="props.selected = !props.selected">
                                    <v-checkbox :input-value="props.selected" primary hide-details></v-checkbox>
                                </td>
                                <td>{{props.item.index+1}}</td>
                                <td>
                                    {{ new Date(props.item.billdate).getDate()+"/"+(new Date(props.item.billdate).getMonth()+1)+"/"+new Date(props.item.billdate).getFullYear() }}
                                </td>
                                <td v-if="mode == 'supplier'">
                                    <router-link class="text-uppercase" :to="'/'+$route.params.username+'/Dashboard/purchase/order/'+props.item.id+'/view'">{{
                                        props.item.billno }}</router-link>
                                </td>
                                <td v-else-if="mode == 'customer'">
                                    <router-link class="text-uppercase" :to="'/'+$route.params.username+'/Dashboard/sales/order/'+props.item.id+'/view'">{{props.item.billbook.prefix+""+props.item.billno}}</router-link>
                                </td>
                                <td>{{props.item.itemtotal}}</td>
                                <td>{{props.item.charges}}</td>
                                <td v-if="taxstatus == 1">{{props.item.taxamount}}</td>
                                <td>{{ props.item.totalamount }}</td>
                                <td v-if="mode == 'supplier'">
                                    <v-btn :to="'/'+$route.params.username+'/Dashboard/purchase/order/'+props.item.id+'/edit'" icon>
                                        <v-icon>edit</v-icon>
                                    </v-btn>
                                </td>
                                <td v-else-if="mode == 'customer'">
                                    <v-btn :to="'/'+$route.params.username+'/Dashboard/sales/order/'+props.item.id+'/edit'" icon>
                                        <v-icon class="grey--text text--darken-2">edit</v-icon>
                                    </v-btn>
                                </td>
                                <td v-if="mode == 'customer'">
                                    <v-btn icon @click="print(props.item.id)"><v-icon class="grey--text text--darken-2">print</v-icon></v-btn>
                                </td>
                            </tr>
                        </template>
                    </v-data-table>
                    </v-card-text>
                    </v-card>

                </v-card-text>
            </v-card>
        </v-flex>
    </v-layout>
</template>
<script>
    import Receipt from "~/components/receiptUI";
    export default {
        components: {
            Receipt
        },
        props: {
            mode: {
                type: String,
                required: true
            },
            startDate: {
                type: String,
                required: true
            },
            endDate: {
                type: String,
                required: true
            },
            billBookId: {
                type: String,
                required: false
            },
            csid: {
                type:String,
                required : false
            }
        },
        data() {
            return {
                header: [{
                    text: '#',
                    align: 'left',
                    value: 'name'
                },
                { text: 'Date', value: 'billdate' },
                { text: 'Bill No', value: 'billno' },
                { text: 'Name', value: 'name' },
                { text: 'Amount(Rs.)', value: 'totalamount' },
                { text: 'Edit', value: 'name' }],
                header2: [{
                    text: '#',
                    align: 'left',
                    value: 'billno'
                },
                { text: 'Date', value: 'billdate' },
                { text: 'Bill No', value: 'billno' },
                { text: 'Basic Amount(Rs)', value: 'itemtotal' },
                { text: 'Charges(Rs)', value: 'charges'},
                { text: 'Tax(Rs)', value: 'taxamount'},
                { text: 'Final Amount', value: 'totalamount' },
                { text: 'Edit', value: 'billno' }],
                loading: true,
                pagination: {},
                totalCustomer: 0,
                startDatemodal: false,
                endDatemodal: false,
                search: "",
                clickPrint: 0,
                orderDtl: [],
                selectOrder: [],
                startDate1: "",
                endDate1: "",
                printid: "",
                printOrderList:[],
                loadingPDF:false,
                loadingExcel:false,
                taxstatus:1
            }

        },
        updated(){
            if(this.printOrderList.length > 0 && this.clickPrint == 1)
            {
                let flag
                for(let i=0;i<this.printOrderList.length;i++)
                {
                    flag=0
                    if(this.printOrderList[i] == "") flag=1
                    else {
                        flag=0
                        break;
                    }
                }
                if(flag == 1) {
                    window.print()
                    this.printOrderList = []
                    this.clickPrint = 0
                }
            }
        },
        created() {
            this.startDate1 = this.startDate
            this.endDate1 = this.endDate
            this.getConfiguration().then(res=>{});
        },
        watch: {
            pagination: {
                handler() {
                    this.getDataFromApi()
                        .then(data => {
                            this.orderDtl = data.items
                            this.totalCustomer = data.total
                        })
                },
                deep: true
            },
            search: {
                handler(){
                    this.getDataFromApi()
                    .then(data => {
                        this.orderDtl = data.items
                        this.totalCustomer = data.total
                    })
                }
            }
        },
        mounted() {
            this.getDataFromApi()
                .then(data => {
                    this.orderDtl = data.items
                    this.totalCustomer = data.total
                })
        },
        methods: {
            print(id) {
                this.printid = id
            },
            toggleAll() {
                if (this.selectOrder.length) this.selectOrder = []
                else this.selectOrder = this.orderDtl.slice()
            },
            changeSort(column) {
                if (this.pagination.sortBy === column) {
                    this.pagination.descending = !this.pagination.descending
                } else {
                    this.pagination.sortBy = column
                    this.pagination.descending = false
                }
            },
            getConfiguration() {
                return new Promise((resolve, reject) => {
                    this.$axios.get("/" + this.$route.params.username + "/api/Configurations?access_token=" + this.$store.state.token)
                        .then(res => {
                            for (let i = 0; i < res.data.length; i++) {
                                if(this.mode == 'customer') {
                                    if (res.data[i].alias == "calculate_taxes_sales") this.taxstatus = res.data[i].value
                                }
                                else if(this.mode == 'supplier') {
                                    if(res.data[i].alias == 'calculate_taxes_purchase') this.taxstatus = res.data[i].value
                                }
                            }
                            if (this.taxstatus == 0) {
                                this.header2.splice(5, 1)
                                resolve()
                            }
                            else resolve()
                        })
                })
            },
            _export(type){
                if(type == "pdf") this.loadingPDF = true
                else this.loadingExcel = true
                const { sortBy, descending, page, rowsPerPage } = this.pagination
                this.getDataFromApi()
                .then(res => {
                    let item = res.items;
                    let header = []
                    header[0] = []
                    let promise = new Promise(resolve=>{
                        if(this.mode == 'sale' || this.mode == 'purchase') {
                            for(let i = 0;i<this.header.length;i++) {
                                if(this.header[i].text != 'Edit' && this.header[i].text != 'Print') {
                                    header[0].push(this.header[i].text)
                                    if(i == this.header.length - 1) resolve()
                                }
                                else if(i == this.header.length - 1) resolve()
                            }
                        }
                        else if (this.mode == 'customer' || this.mode == 'supplier') {
                            for(let i = 0;i<this.header2.length;i++) {
                                if(this.header2[i].text != 'Edit' && this.header2[i].text != 'Print') {
                                    header[0].push(this.header2[i].text)
                                    if(i == this.header2.length - 1) resolve()
                                }
                                else {
                                    if(i == this.header2.length - 1) resolve()
                                }
                            }
                        }
                    })
                    promise.then(resolve=>{
                        let body = []
                        for(let i = 0;i<item.length;i++)
                        {
                            let date = new Date(item[i].billdate).getDate()+"/"+(new Date(item[i].billdate).getMonth()+1)+"/"+new Date(item[i].billdate).getFullYear()
                            if(this.mode == "sale") {
                                body[i] = [(item[i].index+1),date,(item[i].billbook.prefix+""+item[i].billno),item[i].customer.name,item[i].totalamount]
                            }
                            else if(this.mode == 'purchase'){
                                body[i] = [(item[i].index+1),date,item[i].billno,item[i].supplier.name,item[i].totalamount]
                            }
                            else if(this.mode == "customer") {
                                if(this.taxstatus == 1)
                                    body[i] = [(item[i].index+1),date,(item[i].billbook.prefix+""+item[i].billno),item[i].itemtotal,item[i].charges,item[i].taxamount,item[i].totalamount]
                                else
                                    body[i] = [(item[i].index+1),date,(item[i].billbook.prefix+""+item[i].billno),item[i].itemtotal,item[i].charges,item[i].totalamount]
                            }
                            else if(this.mode == "supplier") {
                                if(this.taxstatus == 1)
                                    body[i] = [(item[i].index+1),date,item[i].billno,item[i].itemtotal,item[i].charges,item[i].taxamount,item[i].totalamount]
                                else
                                    body[i] = [(item[i].index+1),date,item[i].billno,item[i].itemtotal,item[i].charges,item[i].totalamount]
                            }
                        }
                        let name = this.mode=="purchase" ? "Purchase" : "Sales"
                        if(type == "pdf") {
                            this.$createPDF(header,body,name+" Listing",process)
                                .then((resolve)=>{this.loadingPDF=false})
                        }
                        else {
                            this.$createExcel(header,body,name+" Listing",process)
                                .then((resolve)=>{this.loadingExcel=false})
                        }
                    })
                });
            },
            getDataFromApi() {
                this.loading = true
                return new Promise((resolve, reject) => {
                    const { sortBy, descending, page, rowsPerPage } = this.pagination
                    let items = "";
                    let getDetails = new Promise((resolve1, reject1) => {
                        if (this.mode == "supplier") {
                            // http://localhost:3030/jay/api/Orders?access_token=5FIQwvmvvuUCeQqfSqT1xCmGf7GdvJe4SUTPTUQ5Q2om9vxss8CadPNHCeVjP23L&filter={%22where%22:{%22and%22:[{%22billdate%22:{%22between%22:[%222019-01-01%22,%222019-02-02%22]}},{%22or%22:[{%22customerId%22:{%22regexp%22:%22a%22}},{%22itemtotal%22:{%22regexp%22:%22a%22}}]}]},%22include%22:%22customer%22}
                            this.$axios.get('/' + this.$route.params.username + '/api/Purchases/getOrders?access_token=' + this.$store.state.token + '&filter={"skip":"'+parseInt(rowsPerPage * (page-1))+'","limit":"'+rowsPerPage+'","startdate":"'+this.startDate1+'","enddate":"'+this.endDate1+'","search":"'+this.search+'","sort":"'+sortBy+'","descending":"'+descending+'","supplierId":"'+this.csid+'"}')
                                .then(res => {
                                    resolve1(res.data)
                                });
                        }
                        else if (this.mode == "customer") {
                            this.$axios.get('/' + this.$route.params.username + '/api/Orders/getOrders?access_token=' + this.$store.state.token + '&filter={"skip":"'+parseInt(rowsPerPage * (page-1))+'","limit":"'+rowsPerPage+'","startdate":"'+this.startDate1+'","enddate":"'+this.endDate1+'","search":"'+this.search+'","sort":"'+sortBy+'","descending":"'+descending+'","customerId":"'+this.csid+'"}')
                                .then(res => {
                                    resolve1(res.data)
                                });
                        }
                        else if(this.mode == 'purchase')
                        {
                            this.$axios.get('/' + this.$route.params.username + '/api/Purchases/getOrders?access_token=' + this.$store.state.token + '&filter={"skip":"'+parseInt(rowsPerPage * (page-1))+'","limit":"'+rowsPerPage+'","startdate":"'+this.startDate1+'","enddate":"'+this.endDate1+'","search":"'+this.search+'","sort":"'+sortBy+'","descending":"'+descending+'"}')
                                .then(res => {
                                    resolve1(res.data)
                                });
                        }
                        else if(this.mode == 'sale') {
                            if (this.billBookId == null) {
                                this.$axios.get('/' + this.$route.params.username + '/api/Orders/getOrders?access_token=' + this.$store.state.token + '&filter={"skip":"'+parseInt(rowsPerPage * (page-1))+'","limit":"'+rowsPerPage+'","startdate":"'+this.startDate1+'","enddate":"'+this.endDate1+'","search":"'+this.search+'","sort":"'+sortBy+'","descending":"'+descending+'"}')
                                    .then(res => {
                                        resolve1(res.data)
                                    });
                            }
                            else {
                                this.$axios.get('/' + this.$route.params.username + '/api/Orders/getOrders?access_token=' + this.$store.state.token + '&filter={"skip":"'+parseInt(rowsPerPage * (page-1))+'","limit":"'+rowsPerPage+'","startdate":"'+this.startDate1+'","enddate":"'+this.endDate1+'","search":"'+this.search+'","sort":"'+sortBy+'","descending":"'+descending+'","billbookId":"'+this.billBookId+'"}')
                                    .then(res => {
                                        resolve1(res.data)
                                    });
                            }
                        }
                    })
                    getDetails.then(resolve1 => {
                        items = resolve1.data;
                        const total = resolve1.total
                        this.loading = false
                        resolve({
                            items,
                            total
                        })
                    });
                })
            },
            getOrders(){
                this.getDataFromApi()
                .then(data => {
                    this.orderDtl = data.items
                    this.totalCustomer = data.total
                })
            },
            printOrder() {
                this.clickPrint = 1
                for(let i=0;i<this.selectOrder.length;i++)
                {
                    this.printOrderList.push(this.selectOrder[i].id)
                }
            },
            async deleteCustomer() {
                let $this = this;
                let deleteOrder = (function(){
                    let deleteo = [];
                    for(let i= 0;i<$this.selectOrder.length;i++)
                    {
                        deleteo.push($this.selectOrder[i].id)
                    }
                    return deleteo
                })();
                if (this.mode == "purchase" || this.mode == "supplier") {
                    if (confirm("Do you really want to delete?")) {
                        this.$axios.post("/" + this.$route.params.username + "/api/Purchases/deletepurchase?access_token=" + this.$store.state.token, {
                            purchaseId: deleteOrder,
                            userId: this.$store.state.userId
                        })
                            .then(res => {
                                if (res.data.status == "done") {
                                    //alert("Successfully Deleted")
                                    //window.location="";
                                    this.$store.commit("snackbar/setSnack", "Order Successfully Deleted");
                                    this.getOrders()
                                }
                            })
                    }
                }
                else if (this.mode == "sale" || this.mode == "customer") {
                    if (confirm("Do you really want to delete?")) {
                        this.$axios.post("/" + this.$route.params.username + "/api/Orders/deleteorder?access_token=" + this.$store.state.token, {
                            orderId: deleteOrder,
                            userId: this.$store.state.userId
                        })
                            .then(res => {
                                if (res.data.status == "done") {
                                    //alert("Successfully Deleted")
                                    //window.location="";
                                    this.$store.commit("snackbar/setSnack", "Order Successfully Deleted");
                                    this.getOrders()
                                }
                            })
                    }
                }
            }
        }
    }
</script>
<style>

</style>