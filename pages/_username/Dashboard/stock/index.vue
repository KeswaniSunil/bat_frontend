<template>
    <v-card flat>
        <v-card-text class="body-background mt-3 padding-xs">
            <v-layout>
                <v-flex sm12>
                    <v-card class="border-radius-5">
                        <v-card-text>
                            <v-layout align-center justify-space-between :class="[$store.state.biggerScreen ? 'row' : 'column']" class="mb-3">
                                <label class="page-heading primary--text ml-2">Stock Listing:</label>
                                <div>
                                    <v-btn color="info" round class="pa-2" @click="showModal = true">
                                        <v-icon dark small class="mr-2"> flash_on</v-icon>Add Stock
                                    </v-btn>
                                    <v-btn color="info" round class="pa-2" :to="'/'+this.$route.params.username+'/Dashboard/stock/subtypeWise'"
                                        nuxt>
                                        <v-icon dark small class="mr-2"> flash_on</v-icon>SubType Wise
                                    </v-btn>
                                </div>
                            </v-layout>
                            <v-layout class="pt-3" align-center justify-start row wrap>
                                <v-flex xs12 sm4>
                                    <v-dialog ref="startdate" v-model="startDatemodal" :return-value.sync="startDate1"
                                        persistent lazy full-width width="290px">
                                        <template v-slot:activator="{ on }">
                                            <v-text-field v-model="startDate1" label="Start Date" prepend-icon="event"
                                                readonly v-on="on"></v-text-field>
                                        </template>
                                        <v-date-picker v-model="startDate1" scrollable :max="endDate1">
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
                                            <v-btn class="" dark round @click="getStock()">Get Stock</v-btn>
                                        </v-flex>
                                    </v-layout>
                                </v-flex>
                            </v-layout>
                            <v-layout column class="pb-2">
                                <v-flex sm12>
                                    <v-layout align-center row wrap>
                                        <v-flex xs12 sm4>
                                            <v-layout row wrap>
                                                <v-flex sm12>
                                                    <v-layout justify-space-between>
                                                        <v-checkbox v-model="purchase" @change="getStock()" label="Purchase"></v-checkbox>
                                                        <v-checkbox v-model="sales" @change="getStock()" label="Sales"></v-checkbox>
                                                    </v-layout>
                                                </v-flex>
                                            </v-layout>
                                        </v-flex>
                                        <v-flex xs12 sm8></v-flex>

                                    </v-layout>
                                </v-flex>
                                <v-flex sm12>

                                </v-flex>
                            </v-layout>
                            <v-card class="elevation-5" style="border-radius:5px;">
                                <v-card-title class="pa-2 primary white--text">
                                    StockLogs of All Items:-
                                </v-card-title>
                                <v-card-text>
                                    <v-layout row wrap>
                                        <v-flex xs12 sm9 class="mb-3">
                                            <v-layout align-start justify-start row wrap>

                                                <v-btn color="primary" round class="pa-0 mr-1" :loading="loadingPDF"
                                                    @click="_export('pdf')">
                                                    <v-icon dark small class="mr-2" reverse>cloud_download</v-icon>Pdf
                                                </v-btn>
                                                <v-btn color="primary" round class="pa-0 " :loading="loadingExcel"
                                                    @click="_export('excel')">
                                                    <v-icon dark small class="mr-2" reverse>cloud_download</v-icon>Excel
                                                </v-btn>

                                            </v-layout>
                                        </v-flex>
                                        <v-flex xs12 sm3 class="mb-3">
                                            <v-text-field v-model="search" append-icon="search" label="Search" class="pa-0 ma-0"
                                                single-line hide-details></v-text-field>
                                        </v-flex>

                                    </v-layout>
                                    <v-data-table :headers="header" :items="stockDtl" :pagination.sync="pagination"
                                        :total-items="totalStock" :loading="loading" select-all item-key="id" class="elevation-0">
                                        <template v-slot:headers="props">
                                            <tr>
                                                <th v-for="header in props.headers" :key="header.text" :class="['column sortable', pagination.descending ? 'desc' : 'asc', header.value === pagination.sortBy ? 'active' : '']"
                                                    @click="changeSort(header.value)" style="text-align:left;">

                                                    {{ header.text }}<v-icon small>arrow_upward</v-icon>
                                                </th>
                                            </tr>
                                        </template>
                                        <template v-slot:items="props">
                                            <tr :class="[(billNo_order[props.index] != null) ? colorred : colorgreen]">

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
                                    </v-data-table>
                                </v-card-text>
                            </v-card>
                            <v-dialog width="500" v-model="showModal">
                                <v-card>
                                    <v-card-title class="pt-2 pb-2" style="border-bottom:1px solid #A5A5A5;">
                                        <span style="font-size:18px;">Add Stock</span>
                                    </v-card-title>
                                    <v-card-text class="pa-0">
                                        <v-container grid-list-xs>
                                            <addStock v-if="showModal==true" v-model="closeModal1"></addStock>
                                        </v-container>
                                    </v-card-text>

                                    <v-divider></v-divider>

                                    <v-card-actions>
                                        <v-spacer></v-spacer>
                                        <v-btn color="primary" flat @click="showModal = false">
                                            Close
                                        </v-btn>
                                    </v-card-actions>
                                </v-card>
                            </v-dialog>
                        </v-card-text>
                    </v-card>
                </v-flex>
            </v-layout>
        </v-card-text>
    </v-card>
</template>
<script>

    import addStock from '@/components/Items/addStock.vue'
    export default {
        components: {
            addStock
        },
        layout: "dashboard",
        created() {
            this.generate();
        },
        updated() {
            if (this.closeModal1 == 2) {
                this.showModal = false
                this.closeModal1 = 1
                this.getDataFromApi()
                    .then(data => {
                        this.stockDtl = data.items
                        this.totalStock = data.total
                    })
            }
        },
        watch: {
            pagination: {
                handler() {
                    this.getDataFromApi()
                        .then(data => {
                            this.stockDtl = data.items
                            this.totalStock = data.total
                        })
                },
                deep: true
            },
            search: {
                handler() {
                    this.getDataFromApi()
                        .then(data => {
                            this.stockDtl = data.items
                            this.totalStock = data.total
                        })
                }
            }
        },
        mounted() {
            this.getDataFromApi()
                .then(data => {
                    this.stockDtl = data.items
                    this.totalStock = data.total
                })
        },
        data() {
            return {
                stockDtl: [],
                closeModal1: 1,
                totalStock: 0,
                search: "",
                header: [{
                    text: '#',
                    align: 'left',
                    sortable: false,
                    value: 'itemname'
                },
                { text: 'Item Name', value: 'itemname' },
                { text: 'Price(Rs.)', value: 'price' },
                { text: 'Quantity', value: 'quantity' },
                { text: 'Bill No', value: 'billno' },
                { text: 'Date', value: 'date' },
                { text: 'Notes', value: 'notes' }],
                loading: true,
                pagination: {},
                startDatemodal: false,
                endDatemodal: false,
                showModal: false,
                billNo_order: [],
                billNo_purchase: [],
                startDate1: null,
                endDate1: null,
                purchase: true,
                sales: true,
                colorgreen: 'green lighten-4',
                colorred: 'red lighten-4',
                loadingPDF: false,
                loadingExcel: false
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
                //console.log("aa")
                this.getDataFromApi()
                    .then(res => {
                        let item = res.items;
                        let header = []
                        header[0] = []
                        for (let i = 0; i < this.header.length; i++) if (this.header[i].text != 'Edit') header[0].push(this.header[i].text)
                        let body = []
                        for (let i = 0; i < item.length; i++) {
                            if (this.billNo_purchase[item[i].index] != null)
                                body[i] = [(item[i].index + 1), item[i].item.name, item[i].price, item[i].quantity, this.billNo_purchase[item[i].index], this.changeToIST(item[i].date), item[i].notes]
                            else if (this.billNo_order[item[i].index] != null)
                                body[i] = [(item[i].index + 1), item[i].item.name, item[i].price, item[i].quantity, this.billNo_order[item[i].index], this.changeToIST(item[i].date), item[i].notes]
                            else
                                body[i] = [(item[i].index + 1), item[i].item.name, item[i].price, item[i].quantity, "-", this.changeToIST(item[i].date), item[i].notes]
                        }
                        let $this = this
                        let name = (function () {
                            if ($this.purchase == true && $this.sales == true) return "Purchase Sales"
                            else if ($this.purchase == true) return "Purchase"
                            else if ($this.sales == true) return "Sales"
                            else ""
                        })();
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
                    this.$axios.get('/' + this.$route.params.username + '/api/Stocklogs/getStocklogs?access_token=' + this.$store.state.token + '&filter={"skip":"' + parseInt(rowsPerPage * (page - 1)) + '","limit":"' + rowsPerPage + '","startdate":"' + this.startDate1 + '","enddate":"' + this.endDate1 + '","purchase":"' + this.purchase + '","sale":"' + this.sales + '","search":"' + this.search + '","sort":"' + sortBy + '","descending":"' + descending + '"}')
                        .then(res => {
                            //this.stockDtl = res.data;
                            this.billNo_order = []
                            this.billNo_purchase = []
                            for (let i = 0; i < res.data.data.length; i++) {
                                if (res.data.data[i].purchaseId != null) {
                                    this.billNo_purchase.push(res.data.data[i].purchase.billno)
                                    this.billNo_order.push(null)
                                }
                                else if (res.data.data[i].orderId != null) {
                                    this.billNo_order.push(res.data.data[i].order.billbook.prefix + "" + res.data.data[i].order.billno)
                                    this.billNo_purchase.push(null)
                                }
                                else {
                                    this.billNo_order.push(null)
                                    this.billNo_purchase.push(null)
                                }
                            }
                            //console.log("bb")
                            items = res.data.data;
                            //console.log("cc")
                            const total = res.data.total
                            this.loading = false
                            resolve({
                                items,
                                total
                            })
                            //console.log(res.data)
                        });
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
                this.getStock()
            },
            getStock() {
                this.getDataFromApi()
                    .then(data => {
                        this.stockDtl = data.items
                        this.totalStock = data.total
                    })
            }
        }
    }
</script>