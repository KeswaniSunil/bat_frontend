<template>
    <v-layout>
        <v-flex xs12 sm12>
            <v-form v-model="valid">
                <v-card class="border-radius-5 ma-3">
                    <v-card-text primary-title>
                        <v-container grid-list-xs>
                            <v-layout align-center justify-start row wrap>
                                <v-flex xs12 sm7>
                                    <v-layout align-center justify-end row wrap>
                                        <v-flex v-if="biggerScreen" xs12 sm3 class="text-lg-left">
                                            <label class="font-16 font-weight-regular">Customer Name: </label>
                                        </v-flex>
                                        <v-flex sm1>
                                        </v-flex>
                                        <v-flex xs12 sm8>
                                            <v-autocomplete v-model="model1" :items="items" @input="call()" append-icon="search"
                                                :loading="isLoading" :search-input.sync="search" hide-no-data
                                                hide-selected item-text="name" item-value="id" label="Customer Name"
                                                placeholder="Customer Name" return-string height=20 :single-line="biggerScreen"></v-autocomplete>
                                        </v-flex>
                                    </v-layout>
                                </v-flex>
                                <v-flex sm1></v-flex>
                                <v-flex xs12 sm4>
                                    <v-layout align-center justify-end row wrap>
                                        <v-flex v-if="biggerScreen" xs12 sm3 class="text-lg-left">
                                            <label class="font-16 font-weight-regular">Bill Date: </label>
                                        </v-flex>
                                        <v-flex sm1>

                                        </v-flex>
                                        <v-flex xs12 sm8>
                                            <v-dialog ref="dialog" v-model="modal" :return-value.sync="date" persistent
                                                lazy full-width width="290px">
                                                <template v-slot:activator="{ on }">
                                                    <v-text-field v-model="date" :single-line="biggerScreen" readonly
                                                        v-on="on" height=20></v-text-field>
                                                </template>
                                                <v-date-picker v-model="date" scrollable>
                                                    <v-spacer></v-spacer>
                                                    <v-btn flat color="primary" @click="modal = false">Cancel</v-btn>
                                                    <v-btn flat color="primary" @click="$refs.dialog.save(date)">OK</v-btn>
                                                </v-date-picker>
                                            </v-dialog>
                                        </v-flex>
                                    </v-layout>
                                </v-flex>
                                <v-flex xs12 sm7>
                                    <v-layout align-center justify-end row wrap>
                                        <v-flex v-if="biggerScreen" xs12 sm3 class="text-lg-left">
                                            <label class="font-16 font-weight-regular">Bill Book: </label>
                                        </v-flex>
                                        <v-flex sm1>

                                        </v-flex>
                                        <v-flex xs12 sm8>
                                            <v-select :items="items1" label="Bill Book" :single-line="biggerScreen"
                                                height=20></v-select>
                                        </v-flex>
                                    </v-layout>
                                </v-flex>
                                <v-flex sm1></v-flex>
                                <v-flex xs12 sm4>
                                    <v-layout align-center justify-end row wrap>
                                        <v-flex v-if="biggerScreen" xs12 sm3 class="text-lg-left">
                                            <label class="font-16 font-weight-regular">Bill No: </label>
                                        </v-flex>
                                        <v-flex sm1>

                                        </v-flex>
                                        <v-flex xs12 sm8>
                                            <v-text-field v-model="firstname" label="Bill No" :single-line="biggerScreen"
                                                height=20 required disabled></v-text-field>
                                        </v-flex>
                                    </v-layout>
                                </v-flex>
                            </v-layout>
                        </v-container>
                        </v-card-text>
                        </v-card>
                        <v-container grid-list-xs>
                            <v-layout column wrap>
                                <v-flex xs3>
                                    <v-layout align-center justify-space-between>
                                        <label class="title">Items Details:</label>
                                        <v-btn round dark @click="addi">
                                            Add Item
                                        </v-btn>
                                    </v-layout>
                                </v-flex>
                                <v-flex xs12 mt-3>
                                    <v-data-table :headers="itemheaders" :items="itemDetails" hide-actions class="elevation-1">
                                        <template v-slot:items="props">
                                            <td>
                                                {{props.index+1}}
                                            </td>
                                            <td style="min-width:300px">
                                                <v-autocomplete v-model="props.item.itemname" @input="call1()"
                                                    append-icon="search" :items="item125" :loading="isLoading"
                                                    :search-input.sync="search1" hide-no-data hide-selected item-text="name"
                                                    item-value="id" label="Item Name" placeholder="Item Name"
                                                    return-string height=20 single-line="true"></v-autocomplete>
                                            </td>
                                            <td style="min-width:80px" class="text-xs-right">
                                                <v-text-field type="number" v-model="props.item.unit" label="Unit"
                                                    single-line="true" height=20 required disabled></v-text-field>
                                            </td>
                                            <td style="min-width:100px" class="text-xs-right">
                                                <v-text-field type="number" v-model="props.item.mrp" label="MRP"
                                                    single-line="true" height=20 required></v-text-field>
                                            </td>
                                            <td class="text-xs-right">
                                                <v-text-field type="number" v-model="props.item.gst" label="GST"
                                                    single-line="true" height=20 required disabled></v-text-field>
                                            </td>
                                            <td class="text-xs-right">
                                                <v-text-field type="number" v-model="props.item.quantity" label="Quantity"
                                                    single-line="true" height=20 required></v-text-field>
                                            </td>
                                            <td class="text-xs-right">
                                                <v-text-field type="number" v-model="props.item.subtotal" label="Sub Total"
                                                    single-line="true" height=20 required disabled></v-text-field>
                                            </td>
                                            <td class="text-xs-right">
                                                <v-btn flat icon>
                                                    <v-icon>delete</v-icon>
                                                </v-btn>
                                            </td>
                                        </template>
                                    </v-data-table>
                                </v-flex>
                            </v-layout>
                            <v-layout mt-3 justify-end>
                                <v-flex xs12 sm6>
                                    <v-layout align-center justify-end row wrap>
                                        <v-flex v-if="biggerScreen" class="text-lg-left" xs12 sm5>
                                            <label class="font-16 font-weight-regular">Discount: </label>
                                        </v-flex>
                                        <v-flex xs10 sm6>
                                            <v-text-field type="number" v-model="model" label="Discount" :single-line="biggerScreen"
                                                height=20 required></v-text-field>
                                        </v-flex>
                                        <v-flex xs2 sm1>
                                            <v-select :items="[{text:'Rs',value:'1'},{text:'%', value:'2'}]" item-text="text"
                                                item-value="value" @change="click()" v-model="dis" :single-line="biggerScreen"
                                                height=20></v-select>
                                        </v-flex>
                                    </v-layout>
                                </v-flex>
                            </v-layout>
                            <v-layout justify-end>
                                <v-flex xs12 sm6>
                                    <v-layout align-center justify-end row wrap>
                                        <v-flex v-if="biggerScreen" xs12 sm5 class="text-lg-left">
                                            <label class="font-16 font-weight-regular">Charges: </label>
                                        </v-flex>
                                        <v-flex xs12 sm7>
                                            <v-text-field type="number" v-model="model" label="Charges" :single-line="biggerScreen"
                                                height=20 required></v-text-field>
                                        </v-flex>
                                    </v-layout>
                                </v-flex>
                            </v-layout>
                            <v-layout justify-end>
                                <v-flex xs12 sm6>
                                    <v-layout align-center justify-end row wrap>
                                        <v-flex v-if="biggerScreen" xs12 sm5 class="text-lg-left">
                                            <label class="font-16 font-weight-regular">Round off: </label>
                                        </v-flex>
                                        <v-flex xs12 sm7>
                                            <v-text-field type="number" v-model="model" label="Round off" :single-line="biggerScreen"
                                                height=20 required disabled></v-text-field>
                                        </v-flex>
                                    </v-layout>
                                </v-flex>
                            </v-layout>
                            <v-layout justify-end>
                                <v-flex xs12 sm6>
                                    <v-layout align-center justify-end row wrap>
                                        <v-flex v-if="biggerScreen" xs12 sm5 class="text-lg-left">
                                            <label class="font-16 font-weight-regular">Total Payable Amount: </label>
                                        </v-flex>
                                        <v-flex xs12 sm7>
                                            <v-text-field type="number" v-model="model" label="Total Payable Amount"
                                                :single-line="biggerScreen" height=20 disabled required></v-text-field>
                                        </v-flex>
                                    </v-layout>
                                </v-flex>
                            </v-layout>
                        </v-container>
                        <v-container grid-list-xs>
                            <v-layout column wrap>
                                <v-flex xs3>
                                    <v-layout align-center justify-space-between>
                                        <label class="title">Payment Details:</label>
                                        <v-btn round dark>
                                            Add Payment
                                        </v-btn>
                                    </v-layout>
                                </v-flex>
                                <v-flex xs12 mt-3>
                                    <v-data-table :headers="paymentheaders" :items="payment" hide-actions class="elevation-1">
                                        <template v-slot:items="props">
                                            <td>
                                                {{props.index+1}}
                                            </td>
                                            <td style="min-width:130px">
                                                <v-dialog ref="dialog" v-model="modal" :return-value.sync="date"
                                                    persistent lazy full-width width="290px">
                                                    <template v-slot:activator="{ on }">
                                                        <v-text-field v-model="props.item.dueDate" :single-line="biggerScreen"
                                                            readonly v-on="on" height=20></v-text-field>
                                                    </template>
                                                    <v-date-picker v-model="props.item.dueDate" scrollable>
                                                        <v-spacer></v-spacer>
                                                        <v-btn flat color="primary" @click="modal = false">Cancel</v-btn>
                                                        <v-btn flat color="primary" @click="$refs.dialog.save(date)">OK</v-btn>
                                                    </v-date-picker>
                                                </v-dialog>
                                            </td>
                                            <td style="min-width:100px" class="text-xs-right">
                                                <v-select :items="['Cash','Cheque','Wallet','Card','other']" v-model="props.item.paymentMethod"
                                                    height=20></v-select>
                                            </td>
                                            <td style="min-width:200px" class="text-xs-right">
                                                <v-textarea class="mt-3" v-model="props.item.notes" height="80" label="Notes"
                                                    single-line="true" solo required></v-textarea>
                                            </td>
                                            <td class="text-xs-right">
                                                <v-text-field type="number" v-model="props.item.recievedAmount" label="Recieved Amount"
                                                    single-line="true" height=20 required></v-text-field>
                                            </td>
                                            <td class="text-xs-right">
                                                <v-btn flat icon>
                                                    <v-icon>delete</v-icon>
                                                </v-btn>
                                            </td>
                                        </template>
                                    </v-data-table>
                                </v-flex>
                            </v-layout>
                            <v-layout mt-3 justify-end>
                                <v-flex xs12 sm6>
                                    <v-layout align-center justify-end row wrap>
                                        <v-flex v-if="biggerScreen" xs12 sm5 class="text-lg-left">
                                            <label class="font-16 font-weight-regular">Total Payable Amount: </label>
                                        </v-flex>
                                        <v-flex xs12 sm7>
                                            <v-text-field type="number" v-model="model" label="Total Payable Amount"
                                                :single-line="biggerScreen" height=20 disabled required></v-text-field>
                                        </v-flex>
                                    </v-layout>
                                </v-flex>
                            </v-layout>
                        </v-container>
                    <!--</v-card-text>
                    <v-card-actions>
                        <v-layout justify-end>
                            <v-btn dark round color="blue">Add Bill</v-btn>
                        </v-layout>
                    </v-card-actions>
                </v-card>-->
            </v-form>
        </v-flex>
    </v-layout>
</template>
<script>
    export default {
        data: () => ({
            biggerScreen: true,
            dis: '1',
            descriptionLimit: 60,
            entries: [],
            model1: "",
            isLoading: false,
            model: null,
            search: null,
            date: new Date().toISOString().substr(0, 10),
            menu: false,
            modal: false,
            items1: ['foo', 'go'],
            itemheaders: [
                { text: '#', value: 'index', sortable: false },
                { text: 'Item Name', value: 'itemname', sortable: false },
                { text: 'Unit', value: 'unit', sortable: false },
                { text: 'MRP', value: 'mrp', sortable: false },
                { text: 'GST', value: 'gst', sortable: false },
                { text: 'Quantity', value: 'quantity', sortable: false },
                { text: 'Sub Total', value: 'subtotal', sortable: false },
                { text: 'Action', value: 'delete', sortable: false }
            ],
            paymentheaders: [
                { text: '#', value: 'index', sortable: false },
                { text: 'Date', value: 'date', sortable: false },
                { text: 'Payment Method', value: 'paymentmethod', sortable: false },
                { text: 'Notes', value: 'notes', sortable: false },
                { text: 'Amount', value: 'amount', sortable: false },
                { text: 'Action', value: 'action', sortable: false }
            ],
            payment: [
                {
                    id: null,
                    dueDate: new Date().toISOString().substr(0, 10),
                    paymentMethod: "",
                    recievedAmount: 0,
                    notes: "",
                    series: 0
                },
                {
                    id: null,
                    dueDate: new Date().toISOString().substr(0, 10),
                    paymentMethod: "",
                    recievedAmount: 0,
                    notes: "",
                    series: 0
                }
            ],
            itemDetails: [
                {
                    id: null,
                    itemId: "",
                    unitName: "",
                    itemName: "",
                    maxquantity: 1,
                    mrp: 0,
                    gst: 0,
                    quantity: 1,
                    subTotal: 0,
                    check: 1,
                    taxAmount: 0,
                    series: 1
                }
            ],
        }),
        computed: {
            items() {
                return this.entries.map(entry => {
                    const name = entry.name.length > this.descriptionLimit
                        ? entry.name.slice(0, this.descriptionLimit) + '...'
                        : entry.name
                    const id = entry.id
                    return Object.assign({}, entry, { id, name })
                })
            }
        },
        watch: {
            search(val) {
                // Items have already been loaded
                if (this.items.length > 0) return

                // Items have already been requested
                if (this.isLoading) return

                this.isLoading = true

                // Lazily load input items
                this.$axios.get('/' + this.$route.params.username + '/api/Customers/customerNames?access_token=AMHo9vQVi854r3gPjzYFUAnFwohRRX8x2uzR3V2mJDJ5JUfXMmfmDNoO5c17EXFx&names=' + val)
                    .then(res => {
                        const { values } = res.data
                        this.entries = values
                    })
                    .catch(err => {
                        console.log(err)
                    })
                    .finally(() => (this.isLoading = false))
            }
        },
        methods: {
            call() {
                alert(this.model1)
            },
            call1() {
                alert(this.itemDetails[0].itemName)
            },
            click() {
                alert(this.dis)
            },
            addi() {
                this.itemDetails.push({
                    id: null,
                    itemId: "",
                    unitName: "",
                    itemName: "",
                    maxquantity: 1,
                    mrp: 0,
                    gst: 0,
                    quantity: 1,
                    subTotal: 0,
                    check: 1,
                    taxAmount: 0,
                    series: 1
                })
            }
        }
    }
</script>
<style>
    .font-16 {
        font-size: 16px
    }
</style>