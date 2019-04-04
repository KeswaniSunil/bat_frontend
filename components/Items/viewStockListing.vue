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
                            <v-layout row wrap>
                                <v-flex xs7 sm3>
                                </v-flex>
                                <v-flex xs5 sm9>
                                    <v-btn class="" dark round @click="getTotal()">Get Stock</v-btn>
                                </v-flex>
                            </v-layout>
                        </v-flex>
                    </v-layout>
                    <v-card class="elevation-5" style="border-radius:5px;">
                        <v-card-title class="pa-2 primary white--text">
                            List of All Items:-
                        </v-card-title>
                        <v-card-text>
                            <v-layout row wrap class="mb-2">
                                <v-flex xs4 sm1>
                                    <v-btn color="primary" round class="pa-0 ma-0" :loading="loadingPDF" @click="_export('pdf')">
                                        <v-icon dark small class="mr-2" reverse>cloud_download</v-icon>Pdf
                                    </v-btn>
                                </v-flex>
                                <v-flex xs5 sm2>
                                    <v-layout row wrap>
                                        <v-flex sm1></v-flex>
                                        <v-flex sm7>
                                            <v-btn color="primary" round class="pa-0 ma-0" :loading="loadingExcel"
                                                @click="_export('excel')">
                                                <v-icon dark small class="mr-2" reverse>cloud_download</v-icon>Excel
                                            </v-btn>
                                        </v-flex>
                                        <v-flex sm4></v-flex>
                                    </v-layout>
                                </v-flex>
                                <v-flex xs3 sm6 class="mb-1"></v-flex>
                                <v-flex xs12 sm3>
                                    <v-text-field v-model="search" append-icon="search" label="Search" class="pa-0 ma-0"
                                        single-line hide-details></v-text-field>
                                </v-flex>

                            </v-layout>
                            <v-data-table flat v-if="mode=='total'" :headers="header" :items="totalStock"
                                :pagination.sync="pagination" :total-items="totalCount" :loading="loading" select-all
                                item-key="id" class="elevation-0">
                                <template v-slot:headers="props">
                                    <tr>
                                        <th v-for="header in props.headers" :key="header.text" :class="['column sortable', pagination.descending ? 'desc' : 'asc', header.value === pagination.sortBy ? 'active' : '']"
                                            @click="changeSort(header.value)" style="text-align:left;">

                                            {{ header.text }}<v-icon small>arrow_upward</v-icon>
                                        </th>
                                    </tr>
                                </template>
                                <template v-slot:items="props">
                                    <tr class="text-xs-left">
                                        <td>{{props.item.index+1}}</td>
                                        <td v-if="props.item.purchaseId!=null">
                                            {{props.item.purchase.billno}}
                                        </td>
                                        <td class="text-uppercase" v-else-if="props.item.orderId!=null">
                                            {{props.item.order.billbook.prefix+""+ props.item.order.billno}}
                                        </td>
                                        <td v-else>-</td>
                                        <td>{{changeToIST(props.item.date)}}</td>
                                        <td v-if="props.item.purchaseId!=null">{{props.item.supplierName}}</td>
                                        <td v-else-if="props.item.orderId!=null">{{props.item.customerName}}</td>
                                        <td v-else>-</td>
                                        <td>{{props.item.quantity}}</td>
                                        <td>{{props.item.price}}</td>
                                        <td><b>{{props.item.notes}}</b></td>
                                    </tr>
                                </template>
                            </v-data-table>
                            <v-data-table v-else :headers="header2" :items="usedStock" :pagination.sync="pagination"
                                :total-items="totalCount" :loading="loading" select-all item-key="id" class="elevation-0">
                                <template v-slot:headers="props">
                                    <tr>
                                        <th v-for="header in props.headers" :key="header.text" :class="['column sortable', pagination.descending ? 'desc' : 'asc', header.value === pagination.sortBy ? 'active' : '']"
                                            @click="changeSort(header.value)" style="text-align:left;">

                                            {{ header.text }}<v-icon small>arrow_upward</v-icon>
                                        </th>
                                    </tr>
                                </template>
                                <template v-slot:items="props">
                                    <tr class="text-xs-left">

                                        <td width="6%">{{props.item.index+1}}</td>
                                        <td class="text-uppercase">
                                            {{props.item.prefix_bill}}
                                        </td>
                                        <td>{{ changeToIST(props.item.date) }}</td>
                                        <td>{{ props.item.order.customer.name }}</td>
                                        <td>{{props.item.quantity}}</td>
                                        <td>{{props.item.price}}</td>
                                        <th><b>{{props.item.notes}}</b></th>
                                    </tr>
                                </template>
                                <v-alert v-slot:no-results :value="true" color="error" icon="warning">
                                    Your search for "{{ search }}" found no results.
                                </v-alert>
                            </v-data-table>
                        </v-card-text>
                    </v-card>

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
                { text: 'Sales Bill No.', value: 'salesbillno' },
                { text: 'Date', value: 'date' },
                { text: 'Customer Name', value: 'customername' },
                { text: 'Quantity', value: 'quantity' },
                { text: 'Price', value: 'price' }],
                newIndex: 0,
                totalStock_p: [],
                totalStock: [],
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
                totalCount: 0,
                search: '',
                loadingPDF: false,
                loadingExcel: false
            }
        },
        created() {
            this.generate()

        },
        watch: {
            pagination: {
                handler() {
                    if (this.mode == "total") {
                        this.getDataFromApi()
                            .then(data => {
                                this.totalStock = data.items
                                this.totalCount = data.total
                            })
                    }
                    else {
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
                    if (this.mode == "total") {
                        this.getDataFromApi()
                            .then(data => {

                                this.totalStock = data.items
                                this.totalCount = data.total
                            })
                    }
                    else {
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
            if (this.mode == "total") {
                this.getDataFromApi()
                    .then(data => {

                        this.totalStock = data.items
                        this.totalCount = data.total
                    })
            }
            else {
                this.getDataFromApi()
                    .then(data => {

                        this.usedStock = data.items
                        this.totalCount = data.total
                        console.log("cc")
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
            _export(type) {
                if (type == "pdf") this.loadingPDF = true
                else this.loadingExcel = true
                const { sortBy, descending, page, rowsPerPage } = this.pagination
                this.getDataFromApi()
                    .then(res => {
                        let item = res.items;
                        let header = []
                        header[0] = []
                        if (this.mode == 'total') {
                            for (let i = 0; i < this.header.length; i++) if (this.header[i].text != 'Edit') header[0].push(this.header[i].text)
                        }
                        else {
                            for (let i = 0; i < this.header2.length; i++) if (this.header2[i].text != 'Edit') header[0].push(this.header2[i].text)
                        }
                        let body = []
                        for (let i = 0; i < item.length; i++) {
                            if (this.mode == 'total') {
                                if (item[i].purchaseId != null)
                                    body[i] = [(item[i].index + 1), item[i].purchase.billno, this.changeToIST(item[i].date), item[i].supplierName, item[i].quantity, item[i].price, item[i].notes]
                                else if (item[i].orderId != null)
                                    body[i] = [(item[i].index + 1), (item[i].order.billbook.prefix + "" + item[i].order.billno), this.changeToIST(item[i].date), item[i].customerName, item[i].quantity, item[i].price, item[i].notes]
                                else
                                    body[i] = [(item[i].index + 1), "-", this.changeToIST(item[i].date), "-", item[i].quantity, item[i].price, item[i].notes]
                            }
                            else {
                                body[i] = [(item[i].index + 1), item[i].prefix_bill, this.changeToIST(item[i].date), item[i].order.customer.name, item[i].quantity, item[i].price, item[i].notes]
                            }
                        }
                        let name = this.mode == 'total' ? "Total" : "Used"
                        if (type == "pdf") {
                            this.$createPDF(header, body, name + " Stock Listing", process)
                                .then((resolve) => { this.loadingPDF = false })
                        }
                        else {
                            this.$createExcel(header, body, name + " Stock Listing", process)
                                .then((resolve) => { this.loadingExcel = false })
                        }
                    });
            },
            getDataFromApi() {
                this.loading = true
                return new Promise((resolve, reject) => {
                    const { sortBy, descending, page, rowsPerPage } = this.pagination
                    //console.log("aa")
                    let items = [];
                    if (this.mode == 'total') {

                        this.$axios.get('/' + this.$route.params.username + '/api/Stocklogs/getTotalStock?access_token=' + this.$store.state.token + '&filter={"skip":"' + parseInt(rowsPerPage * (page - 1)) + '","limit":"' + rowsPerPage + '","startdate":"' + this.startDate1 + '","enddate":"' + this.endDate1 + '","id":"' + this.$route.params.stockListing + '","search":"' + this.search + '","sort":"' + sortBy + '","descending":"' + descending + '"}')
                            .then(res => {
                                //console.log(res.data.data)
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
                    else {
                        this.$axios.get('/' + this.$route.params.username + '/api/Stocklogs/getUsedStock?access_token=' + this.$store.state.token + '&filter={"skip":"' + parseInt(rowsPerPage * (page - 1)) + '","limit":"' + rowsPerPage + '","startdate":"' + this.startDate1 + '","enddate":"' + this.endDate1 + '","id":"' + this.$route.params.stockListing + '","search":"' + this.search + '","sort":"' + sortBy + '","descending":"' + descending + '"}')
                            .then(res => {

                                items = res.data.data;
                                //console.log(items)
                                //console.log("cc")
                                const total = res.data.total
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
                if (this.mode == "total") {
                    this.getDataFromApi()
                        .then(data => {

                            this.totalStock = data.items
                            this.totalCount = data.total
                            //console.log(this.totalStock)
                        })
                }
                else {

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