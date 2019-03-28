<template>
    <v-layout row wrap>
        <v-flex xs12 text-xs-center>
            <v-card flat>
                <v-card-text class="grey lighten-3">
                    <v-layout>
                        <v-flex sm12>
                            <v-card class="border-radius-5">
                                <v-card-text>
                                    <v-layout align-center justify-start row wrap class="mb-3">
                                        <v-flex xs7 sm10></v-flex>
                                        <v-flex xs5 sm2>
                                            <v-layout align-center justify-start row wrap>
                                                <v-flex sm4></v-flex>
                                                <v-flex sm8>
                                                    <v-btn color="info" round class="pa-2" @click="showModal = true">
                                                        <v-icon dark small class="mr-2"> gavel</v-icon>Add Stock
                                                    </v-btn>
                                                </v-flex>
                                            </v-layout>
                                        </v-flex>
                                    </v-layout>
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
                                                <v-flex xs8 sm3>
                                                </v-flex>
                                                <v-flex xs4 sm9>
                                                    <v-btn class="" dark round @click="getStock()">Get Stock</v-btn>
                                                </v-flex>
                                            </v-layout>
                                        </v-flex>
                                    </v-layout>
                                    <v-layout column class="pb-2">
                                        <v-flex sm12>
                                            <v-layout align-center row wrap>

                                                <v-flex sm9></v-flex>
                                                <v-flex xs12 sm3>
                                                    <v-text-field v-model="search" append-icon="search" label="Search"
                                                        single-line hide-details></v-text-field>
                                                </v-flex>
                                            </v-layout>
                                        </v-flex>
                                    </v-layout>
                                    <v-data-table v-model="selectStock" :headers="header" :items="stockDtl"
                                        :pagination.sync="pagination" :total-items="totalStock" :loading="loading"
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
                                            <tr :class="[(billNo_order[props.index] != null) ? colorred : colorgreen]">

                                                <td width="6%">{{props.index+1}}</td>
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
                                                <td width="10%">
                                                    <v-icon small class="mr-12" @click="editType(props.item.id)">edit
                                                    </v-icon>
                                                </td>
                                            </tr>
                                        </template>
                                        <v-alert v-slot:no-results :value="true" color="error" icon="warning">
                                            Your search for "{{ search }}" found no results.
                                        </v-alert>
                                    </v-data-table>
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
        </v-flex>
    </v-layout>
</template>
<script>

    import addStock from '@/components/Items/addStock.vue'
    export default {
        components: {
            addStock
        },
        layout: "dashboard_ly",
        created() {
            this.$store.state.token = '5FIQwvmvvuUCeQqfSqT1xCmGf7GdvJe4SUTPTUQ5Q2om9vxss8CadPNHCeVjP23L'
            this.$store.state.userId = 1
            this.generate();
        },
        beforeUpdate() {


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
                selectStock: [],
                closeModal1: 1,
                totalStock: 0,
                search: "",
                header: [{
                    text: '#',
                    align: 'left',
                    sortable: false,
                    value: 'ind'
                },
                { text: 'Item Name', value: 'Item Name' },
                { text: 'Price', value: 'Price' },
                { text: 'Quantity', value: 'Quantity' },
                { text: 'Bill No', value: 'Bill No' },
                { text: 'Date', value: 'Date' },
                { text: 'Notes', value: 'Notes' },
                { text: 'Edit', value: 'edit' }],
                loading: true,
                pagination: {},
                startDatemodal: false,
                endDatemodal: false,
                showModal: false,
                billNo_order: [],
                billNo_purchase: [],
                startDate1: null,
                endDate1: null,
                colorgreen: 'green lighten-4',
                colorred: 'red lighten-4'
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
                    let items = "";
                    this.$axios.get("/" + this.$route.params.username + "/api/Stocklogs?access_token=" + this.$store.state.token + "&filter[include]=item&filter[where][isenabled]=1&filter[include]=purchase&filter[include]=order&filter[where][date][between][0]=" + this.startDate1 + "&filter[where][date][between][1]=" + this.endDate1)
                        .then(res => {
                            this.stockDtl = res.data;
                            this.billNo_order = []
                            this.billNo_purchase = []
                            for (let i = 0; i < res.data.length; i++) {
                                if (res.data[i].purchaseId != null) {
                                    this.billNo_purchase.push(res.data[i].purchase.billno)
                                    this.billNo_order.push(null)
                                }
                                else if (res.data[i].orderId != null) {
                                    this.billNo_order.push(res.data[i].order.billno)
                                    this.billNo_purchase.push(null)
                                }
                                else {
                                    this.billNo_order.push(null)
                                    this.billNo_purchase.push(null)
                                }
                            }

                            //console.log("bb")
                            items = res.data;
                            //console.log("cc")
                            const total = items.length

                            if (this.pagination.sortBy) {
                                items = items.sort((a, b) => {
                                    const sortA = a[sortBy]
                                    const sortB = b[sortBy]

                                    if (descending) {
                                        if (sortA < sortB) return 1
                                        if (sortA > sortB) return -1
                                        return 0
                                    } else {
                                        if (sortA < sortB) return -1
                                        if (sortA > sortB) return 1
                                        return 0
                                    }
                                })
                            }

                            if (rowsPerPage > 0) {
                                items = items.slice((page - 1) * rowsPerPage, page * rowsPerPage)
                            }

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
            async generate(val) {
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
                        this.orderDtl = data.items
                        this.totalCustomer = data.total
                    })
            },
            sendId(event) {
                this.checkAll = false;
                if (event.target.checked) {
                    this.enableDel = 1;
                }
                else {
                    if (this.selectStock.length == 0) {
                        this.enableDel = 0;
                    }
                }
                //console.log(this.selectCustomer);
                //console.log(this.selectCustomer.length)
            },
            allSelect() {
                this.selectStock = [];
                this.enableDel = 0;
                if (this.checkAll) {
                    this.enableDel = 1
                    for (let i in this.stockDtl) {
                        this.selectStock.push(this.stockDtl[i].id);
                        // console.log(this.selectCustomer[i]);
                    }
                }
                // console.log(this.selectCustomer)
            },
        }
    }
</script>