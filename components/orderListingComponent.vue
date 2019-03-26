<template>
    <v-layout>
        <v-flex xs12 sm12>
            <v-card class="border-radius-5">
                <v-card-text class="pt-0">
                    <v-layout class="pt-3" align-center justify-start row wrap>
                        <v-flex xs12 sm4>
                            <v-dialog ref="startdate" v-model="startDatemodal" :return-value.sync="startDate1"
                                persistent lazy full-width width="290px">
                                <template v-slot:activator="{ on }">
                                    <v-text-field v-model="startDate1" label="Start Date" prepend-icon="event" readonly
                                        v-on="on"></v-text-field>
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
                                <v-flex xs3 sm1>
                                    <v-btn v-if="selectOrder.length > 0" color="error" round class="pa-0" @click="deleteCustomer">
                                        <v-icon dark small class="mr-1">gavel</v-icon> Delete
                                    </v-btn>
                                </v-flex>
                                <v-flex xs9 sm8></v-flex>
                                <v-flex xs12 sm3>
                                <v-text-field v-model="search" append-icon="search" label="Search" single-line hide-details></v-text-field></v-flex>
                            </v-layout>
                        </v-flex>
                    </v-layout>
                    <v-data-table v-model="selectOrder" :headers="header" :items="orderDtl" :pagination.sync="pagination"
                        :total-items="totalCustomer" :loading="loading" select-all item-key="id" class="elevation-0">
                        <template v-slot:headers="props">
                            <tr>
                                <th>
                                    <v-checkbox :input-value="props.all" :indeterminate="props.indeterminate" primary
                                        hide-details @click.stop="toggleAll"></v-checkbox>
                                </th>
                                <th v-for="header in props.headers" :key="header.text" :disable-initial-sort="header.value == 'name'" :class="['column sortable', pagination.descending ? 'desc' : 'asc', header.value === pagination.sortBy ? 'active' : '']"
                                    @click="changeSort(header.value)">
                                    <v-icon v-if="header.value != 'name'" small>arrow_upward</v-icon>
                                    {{ header.text }}
                                </th>
                            </tr>
                        </template>
                        <template v-slot:no-data>
                            <v-alert :value="true" color="error" icon="warning">
                                Sorry, nothing to display here :(
                            </v-alert>
                        </template>
                        <template v-slot:items="props">
                            <tr>
                                <td :active="props.selected" @click="props.selected = !props.selected">
                                    <v-checkbox :input-value="props.selected" primary hide-details></v-checkbox>
                                </td>
                                <td>{{props.index+1}}</td>
                                <td>
                                    {{ new Date(props.item.billdate).getDate()+"/"+(new Date(props.item.billdate).getMonth()+1)+"/"+new Date(props.item.billdate).getFullYear() }}
                                </td>
                                <td v-if="mode == 'purchase'">
                                    <router-link class="text-uppercase" :to="'/'+$route.params.username+'/dashboard/purchase/order/'+props.item.id+'/view'">{{
                                        props.item.billno }}</router-link>
                                </td>
                                <td v-else-if="mode == 'sale'">
                                    <router-link class="text-uppercase" :to="'/'+$route.params.username+'/dashboard/sales/order/'+props.item.id+'/view'">{{props.item.billbook.prefix+""+props.item.billno
                                        }}</router-link>
                                </td>
                                <td v-if="mode == 'purchase'">
                                    <router-link class="text-capitalize" :to="'/'+$route.params.username+'/dashboard/purchase/supplier/'+props.item.supplier.id+'/viewAllDetails'">{{props.item.supplier.name}}</router-link>
                                </td>
                                <td v-else-if="mode == 'sale'">
                                    <router-link class="text-capitalize" :to="'/'+$route.params.username+'/dashboard/sales/customer/'+props.item.customer.id+'/viewAllDetails'">{{props.item.customer.name}}</router-link>
                                </td>
                                <td>{{ props.item.totalamount }}</td>
                                <td v-if="mode == 'purchase'">
                                    <router-link :to="'/'+$route.params.username+'/dashboard/purchase/order/'+props.item.id+'/edit'"
                                        class="">
                                        <v-icon>edit</v-icon>
                                    </router-link>
                                </td>
                                <td v-else-if="mode == 'sale'">
                                    <router-link :to="'/'+$route.params.username+'/dashboard/sales/order/'+props.item.id+'/edit'"
                                        class="">
                                        <v-icon>edit</v-icon>
                                    </router-link>
                                </td>
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
        components: {
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
            }
        },
        data() {
            return {
                header: [{
                    text: '#',
                    align: 'left',
                    sortable: false,
                    value: 'ind'
                },
                { text: 'Date', value: 'billdate', sortable: false },
                { text: 'Bill No', value: 'billno' },
                { text: 'Name', value: 'name' },
                { text: 'Amount', value: 'totalamount' },
                { text: 'Edit', value: 'edit' }],
                loading: true,
                pagination: {},
                totalCustomer: 0,
                startDatemodal: false,
                endDatemodal: false,
                search: "",
                orderDtl: [],
                selectOrder: [],
                startDate1: "",
                endDate1: "",
                printid: ""
            }

        },
        created() {
            this.startDate1 = this.startDate
            this.endDate1 = this.endDate
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
            }
        },
        mounted() {
            this.$store.state.token = '5FIQwvmvvuUCeQqfSqT1xCmGf7GdvJe4SUTPTUQ5Q2om9vxss8CadPNHCeVjP23L'
            this.getDataFromApi()
                .then(data => {
                    this.orderDtl = data.items
                    this.totalCustomer = data.total
                })
        },
        methods: {
            toggleAll() {
                if (this.selectOrder.length) this.selectOrder = []
                else this.selectOrder = this.orderDtl.slice()
            },
            changeSort(column) {
                if(column != 'name'){
                    if (this.pagination.sortBy === column) {
                        this.pagination.descending = !this.pagination.descending
                    } else {
                        this.pagination.sortBy = column
                        this.pagination.descending = false
                    }
                }
            },
            getDataFromApi() {
                this.loading = true
                return new Promise((resolve, reject) => {
                    const { sortBy, descending, page, rowsPerPage } = this.pagination
                    let items = "";
                    let getDetails = new Promise((resolve1, reject1) => {
                        if (this.mode == "purchase") {
                            // http://localhost:3030/jay/api/Purchases?access_token=5FIQwvmvvuUCeQqfSqT1xCmGf7GdvJe4SUTPTUQ5Q2om9vxss8CadPNHCeVjP23L&filter={"where":{"or":[{"supplierId":{"regexp":"130"}},{"itemtotal":{"regexp":"130"}}]}}
                            this.$axios.get("/" + this.$route.params.username + "/api/Purchases?access_token=" + this.$store.state.token + "&filter[where][isenabled]=1&filter[include]=supplier&filter[where][billdate][between][0]=" + this.startDate1 + "&filter[where][billdate][between][1]=" + this.endDate1)
                                .then(res => {
                                    resolve1(res.data)
                                });
                        }
                        else if (this.mode == "sale") {
                            if (this.billBookId == null) {
                                this.$axios.get("/" + this.$route.params.username + "/api/Orders?access_token=" + this.$store.state.token + "&filter[where][isenabled]=1&filter[include]=customer&filter[include]=billbook&filter[where][billdate][between][0]=" + this.startDate1 + "&filter[where][billdate][between][1]=" + this.endDate1)
                                    .then(res => {
                                        resolve1(res.data)
                                    });
                            }
                            else {
                                this.$axios.get("/" + this.$route.params.username + "/api/Orders?access_token=" + this.$store.state.token + "&filter[where][isenabled]=1&filter[where][billbookId]=" + this.billBookId + "&filter[include]=customer&filter[include]=billbook&filter[where][billdate][between][0]=" + this.startDate1 + "&filter[where][billdate][between][1]=" + this.endDate1)
                                    .then(res => {
                                        resolve1(res.data)
                                    });
                            }
                        }
                    })
                    getDetails.then(resolve1 => {
                        items = resolve1;
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
            async deleteCustomer() {
                if (this.mode == "purchase") {
                    if (confirm("Do you really want to delete?")) {
                        this.$axios.post("/" + this.$route.params.username + "/api/Purchases/deletepurchase?access_token=" + this.$store.state.token, {
                            purchaseId: this.selectOrder,
                            userId: this.$store.state.userId
                        })
                            .then(res => {
                                if (res.data.status == "done") {
                                    //alert("Successfully Deleted")
                                    //window.location="";
                                    this.generate()
                                }
                            })
                    }
                }
                else if (this.mode == "sale") {
                    if (confirm("Do you really want to delete?")) {
                        this.$axios.post("/" + this.$route.params.username + "/api/Orders/deleteorder?access_token=" + this.$store.state.token, {
                            orderId: this.selectOrder,
                            userId: this.$store.state.userId
                        })
                            .then(res => {
                                if (res.data.status == "done") {
                                    //alert("Successfully Deleted")
                                    //window.location="";
                                    this.generate()
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