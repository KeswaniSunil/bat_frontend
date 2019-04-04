<template>
    <v-layout>
        <v-flex xs12 sm12>
            <v-form @submit.prevent="addBill" ref="form" lazy-validation onkeypress="return event.keyCode != 13"
                v-model="valid">
                <v-layout class="mt-3 mr-3" v-if="type != null" justify-end>
                    <v-btn to="edit" round dark>Edit</v-btn>
                </v-layout>
                <v-card class="border-radius-5 ml-3 mr-3 mb-3">
                    <v-card-text primary-title>
                        <v-container grid-list-xs>
                            <loadercontent v-if="loader1" />
                            <v-layout align-center justify-start row wrap>
                                <v-flex xs12 sm6>
                                    <v-layout align-center justify-end row wrap>
                                        <v-flex v-if="biggerScreen" xs12 sm3 class="text-lg-left">
                                            <label class="font-15 font-weight-regular">Supplier Name: </label>
                                        </v-flex>
                                        <v-flex sm1>
                                        </v-flex>
                                        <v-flex xs12 sm8>
                                            <v-autocomplete v-if="id == null" v-model="idToBeSent.supplierId" :items="supplierACVitems"
                                                @input="newSupplier" :rules="requiredRules" append-icon="search"
                                                :loading="supplierACV.isLoading" :search-input.sync="supplierACV.search"
                                                hide-no-data hide-selected item-text="name" item-value="id" label="Supplier Name"
                                                placeholder="Supplier Name" return-string height=20 :single-line="biggerScreen"></v-autocomplete>
                                            <v-text-field v-else v-model="billDetail.supplierName" height=20 disabled></v-text-field>
                                        </v-flex>
                                    </v-layout>
                                </v-flex>
                                <v-flex sm1></v-flex>
                                <v-flex xs12 sm5>
                                    <v-layout align-center justify-end row wrap>
                                        <v-flex v-if="biggerScreen" xs12 sm3 class="text-lg-left">
                                            <label class="font-15 font-weight-regular">Bill Date: </label>
                                        </v-flex>
                                        <v-flex sm1>

                                        </v-flex>
                                        <v-flex xs12 sm8>
                                            <v-dialog ref="dialogbilldate" v-model="modalbilldate" :return-value.sync="billDetail.billDate"
                                                persistent lazy full-width width="290px">
                                                <template v-slot:activator="{ on }">
                                                    <v-text-field v-model="billDetail.billDate" :rules="requiredRules"
                                                        :single-line="biggerScreen" readonly v-on="on" height=20 :disabled="type != null"></v-text-field>
                                                </template>
                                                <v-date-picker v-model="billDetail.billDate" scrollable>
                                                    <v-spacer></v-spacer>
                                                    <v-btn flat color="primary" @click="modalbilldate = false">Cancel</v-btn>
                                                    <v-btn flat color="primary" @click="$refs.dialogbilldate.save(billDetail.billDate)">OK</v-btn>
                                                </v-date-picker>
                                            </v-dialog>
                                        </v-flex>
                                    </v-layout>
                                </v-flex>
                                <v-flex xs12 sm6>
                                    <v-layout align-center justify-end row wrap>
                                        <v-flex v-if="biggerScreen" xs12 sm3 class="text-lg-left">
                                            <label class="font-15 font-weight-regular">Bill No: </label>
                                        </v-flex>
                                        <v-flex sm1>

                                        </v-flex>
                                        <v-flex xs12 sm8>
                                            <v-text-field label="Bill No" :disabled="type != null" v-model="billPreNo.billNo" :rules="requiredRules"
                                                :single-line="biggerScreen" height=20></v-text-field>
                                        </v-flex>
                                    </v-layout>
                                </v-flex>
                            </v-layout>
                        </v-container>
                    </v-card-text>
                </v-card>
                <v-card class="ma-3 border-radius-5">
                <v-card-title>
                <v-container style="max-width:100%" class="pa-0" grid-list-xs>
                    <loadercontent v-if="loader2" />
                    <v-layout column wrap>
                        <v-flex xs3>
                            <v-layout align-center justify-space-between>
                                <label class="title">Items Details:</label>
                                <v-btn v-if="biggerScreen == true && type == null" round dark @click="createItemRow()">
                                    Add Item
                                </v-btn>
                            </v-layout>
                        </v-flex>
                        <!-- Laptop View Item -->
                        <v-flex v-if="biggerScreen == true" xs12 mt-3>
                            <v-data-table :headers="itemheaders" :items="itemDetails" hide-actions class="elevation-0">
                                <template v-slot:items="props">
                                    <td>
                                        {{props.index+1}}
                                    </td>
                                    <td style="min-width:300px">
                                        <v-autocomplete v-model="props.item.itemId" @input="itemGenerate(props.index)"
                                            append-icon="search" v-if="props.item.check == 1" :items="itemsACVitems"
                                            :loading="itemsACV.isLoading" :search-input.sync="itemsACV.search"
                                            hide-no-data hide-selected item-text="name" item-value="id" label="Item Name"
                                            placeholder="Item Name" return-string height=20 :single-line="true"></v-autocomplete>
                                        <v-text-field v-else v-model="props.item.itemName" height=20 :single-line="true"
                                            disabled></v-text-field>
                                    </td>
                                    <td style="min-width:80px" class="text-xs-right">
                                        <v-text-field type="text" v-model="props.item.unitName" label="Unit"
                                            :single-line="true" height=20 disabled></v-text-field>
                                    </td>
                                    <td style="min-width:100px" class="text-xs-right">
                                        <v-text-field type="number" v-model="props.item.mrp" label="MRP" step="any" min="0"
                                            :single-line="true" height=20 :disabled="type != null" @keyup="getSubTotal(props.index)"></v-text-field>
                                    </td>
                                    <td v-if="configuration.taxes == 1" class="text-xs-right">
                                        <v-text-field type="number" v-model="props.item.gst" label="GST" :single-line="true"
                                            height=20 disabled></v-text-field>
                                    </td>
                                    <td class="text-xs-right">
                                        <v-text-field type="number" v-model="props.item.quantity" :disabled="type != null"
                                            min="1" label="Quantity" @keyup="getSubTotal(props.index)" @change="getSubTotal(props.index)" :single-line="true" height=20></v-text-field>
                                    </td>
                                    <td class="text-xs-right">
                                        <v-text-field type="number" v-model="props.item.subTotal" label="Sub Total"
                                            :single-line="true" height=20 disabled></v-text-field>
                                    </td>
                                    <td class="text-xs-right">
                                        <v-btn :disabled="type != null" flat icon @click="removeItemRow(props.index)">
                                            <v-icon>delete</v-icon>
                                        </v-btn>
                                    </td>
                                </template>
                            </v-data-table>
                        </v-flex>
                        <!-- Mobile View Item -->
                        <v-flex v-else xs12 mt-3>
                            <v-card class="border-radius-5">
                                <v-card-text class="pa-0" primary-title>
                                    <v-layout v-for="(cd,index) in itemDetails" :key="index" row wrap>
                                        <v-flex v-if="index < itemDetails.length-1" xs12>
                                            <v-layout align-center row wrap>
                                                <v-flex xs2>
                                                    <v-icon :disabled="type != null" @click="removeItemRow(index);removeItemModalRow(index)">delete</v-icon>
                                                </v-flex>
                                                <v-flex xs6>
                                                    <v-layout overflow-x-scroll align-center justify-start class="text-no-wrap text-capitalize">
                                                        <v-flex xs12 text-xs-left>
                                                            <div class="font-15 font-weight-bold">{{ cd.itemName }}</div>
                                                            <div class="font-13 ml-1 mb-2">
                                                                <span>{{ cd.mrp+" x "+cd.quantity }}</span>
                                                                <span v-if="configuration.taxes == 1">
                                                                    {{ " x "+cd.gst+"%"}}
                                                                </span>
                                                            </div>
                                                        </v-flex>
                                                    </v-layout>
                                                </v-flex>
                                                <v-flex xs2 overflow-x-scroll font-weight-medium>
                                                    {{ cd.subTotal }}
                                                </v-flex>
                                                <v-flex xs2>
                                                    <v-icon :disabled="type != null" @click="itemModalIndex = index;modalPreItem = true;">edit</v-icon>
                                                </v-flex>
                                            </v-layout>
                                            <v-divider v-if="index < itemDetails.length - 2"></v-divider>
                                        </v-flex>
                                    </v-layout>
                                </v-card-text>
                            </v-card>
                            <v-layout mt-2 align-left justify-start row wrap overflow-x-hidden>
                                <v-flex v-if="type==null" xs12>
                                    <v-btn round dark @click="modalPreItem = true;" class="width-90">Add Item</v-btn>
                                </v-flex>
                            </v-layout>
                        </v-flex>
                    </v-layout>
                    <v-layout px-2 mt-3 justify-end>
                        <v-flex xs12 sm6>
                            <v-layout align-center justify-end row wrap>
                                <v-flex v-if="biggerScreen" class="text-lg-left" xs12 sm5>
                                    <label class="font-15 font-weight-regular">Discount: </label>
                                </v-flex>
                                <v-flex xs10 sm6>
                                    <v-text-field type="number" :disabled="type != null" v-model.number="billDetail.discount" min="0" @keyup="getBillTotal"
                                        @change="getBillTotal" label="Discount" :single-line="biggerScreen" height=20></v-text-field>
                                </v-flex>
                                <v-flex xs2 sm1>
                                    <v-select :items="[{text:'Rs',value:'1'},{text:'%', value:'2'}]" item-text="text"
                                        item-value="value" :rules="requiredRules" :disabled="type != null" v-model="billDetail.discountType"
                                        @change="getBillTotal" :single-line="biggerScreen" height=20></v-select>
                                </v-flex>
                            </v-layout>
                        </v-flex>
                    </v-layout>
                    <v-layout px-2 justify-end>
                        <v-flex xs12 sm6>
                            <v-layout align-center justify-end row wrap>
                                <v-flex v-if="biggerScreen" xs12 sm5 class="text-lg-left">
                                    <label class="font-15 font-weight-regular">Charges: </label>
                                </v-flex>
                                <v-flex xs12 sm7>
                                    <v-text-field type="number" :disabled="type != null" min="0" v-model.number="billDetail.charges" @keyup="getBillTotal"
                                        @change="getBillTotal" label="Charges" :single-line="biggerScreen" height=20></v-text-field>
                                </v-flex>
                            </v-layout>
                        </v-flex>
                    </v-layout>
                    <v-layout px-2 justify-end>
                        <v-flex xs12 sm6>
                            <v-layout align-center justify-end row wrap>
                                <v-flex v-if="biggerScreen" xs12 sm5 class="text-lg-left">
                                    <label class="font-15 font-weight-regular">Round off: </label>
                                </v-flex>
                                <v-flex xs12 sm7>
                                    <v-text-field type="number" step="any" v-model="billDetail.roundoff" label="Round off"
                                        :single-line="biggerScreen" height=20 disabled></v-text-field>
                                </v-flex>
                            </v-layout>
                        </v-flex>
                    </v-layout>
                    <v-layout px-2 justify-end>
                        <v-flex xs12 sm6>
                            <v-layout align-center justify-end row wrap>
                                <v-flex v-if="biggerScreen" xs12 sm5 class="text-lg-left">
                                    <label class="font-15 font-weight-regular">Total Payable Amount: </label>
                                </v-flex>
                                <v-flex xs12 sm7>
                                    <v-text-field type="number" v-model="billDetail.totalPayableAmount" label="Total Payable Amount"
                                        :single-line="biggerScreen" height=20 disabled></v-text-field>
                                </v-flex>
                            </v-layout>
                        </v-flex>
                    </v-layout>
                </v-container>
                </v-card-title>
                </v-card>
                <v-card class="ma-3 border-radius-5">
                <v-card-title>
                <v-container style="max-width:100%" class="pa-0" grid-list-xs>
                    <loadercontent v-if="loader3" />
                    <v-layout column wrap>
                        <v-flex xs3>
                            <v-layout align-center justify-space-between>
                                <label class="title">Payment Details:</label>
                                <v-btn v-if="biggerScreen == true && type == null" round dark>
                                    Add Payment
                                </v-btn>
                            </v-layout>
                        </v-flex>
                        <!-- Laptop View-->
                        <v-flex v-if="biggerScreen == true" xs12 mt-3>
                            <v-data-table :headers="paymentheaders" :items="payment" hide-actions class="elevation-0">
                                <template v-slot:items="props">
                                    <td>
                                        {{props.index+1}}
                                    </td>
                                    <td style="min-width:130px">
                                        <v-dialog :ref="props.index" v-model="props.item.modalduedate"
                                            :return-value.sync="props.item.dueDate" persistent lazy full-width width="290px">
                                            <template v-slot:activator="{ on }">
                                                <v-text-field v-model="props.item.dueDate" :disabled="type != null" :single-line="biggerScreen"
                                                    readonly v-on="on" height=20></v-text-field>
                                            </template>
                                            <v-date-picker v-model="props.item.dueDate" scrollable>
                                                <v-spacer></v-spacer>
                                                <v-btn flat color="primary" @click="props.item.modalduedate = false">Cancel</v-btn>
                                                <v-btn flat color="primary" @click="$refs[props.index].save(props.item.dueDate)">OK</v-btn>
                                            </v-date-picker>
                                        </v-dialog>
                                    </td>
                                    <td style="min-width:100px" class="text-xs-right">
                                        <v-select :items="['Cash','Cheque','Wallet','Card','other']" :disabled="type != null" @change="paymentAdd(props.index)"
                                            v-model="props.item.paymentMethod" height=20></v-select>
                                    </td>
                                    <td style="min-width:200px;" class="text-xs-right">
                                        <v-text-field height=20 v-model="props.item.notes"  :disabled="type != null" label="Notes" :single-line="true"
                                            ></v-text-field>
                                    </td>
                                    <td class="text-xs-right">
                                        <v-text-field type="number" v-model="props.item.paidAmount"  label="Recieved Amount"
                                            min="0" @keyup="getReceviable()" @change="getReceviable()" :disabled="props.item.id != null || type != null"
                                            :single-line="true" height=20></v-text-field>
                                    </td>
                                    <td class="text-xs-right">
                                        <v-btn :disabled="type != null" @click="removePaymentRow(props.index)" flat icon>
                                            <v-icon>delete</v-icon>
                                        </v-btn>
                                    </td>
                                </template>
                            </v-data-table>
                        </v-flex>
                        <!-- Mobile View Payment -->
                        <v-flex v-else xs12 mt-3>
                            <v-card v-if="payment.length-1 > 0" class="border-radius-5">
                                <v-card-text class="pa-1" primary-title>
                                    <v-layout v-for="(cd,index) in payment" :key="index" row wrap>
                                        <v-flex v-if="index < payment.length-1" xs12>
                                            <v-layout align-center justify-center row wrap>
                                                <v-flex xs2>
                                                    <v-icon :disabled="type != null" @click="removePaymentRow(index)">delete</v-icon>
                                                </v-flex>
                                                <v-flex xs2 class="overflow-x-scroll">
                                                    <span class="text-no-wrap">
                                                        {{ new Date(cd.dueDate).getDate()+"/"+(new Date(cd.dueDate).getMonth()+1)+"/"+new Date(cd.dueDate).getFullYear() }}
                                                    </span>
                                                </v-flex>
                                                <v-flex xs3 overflow-x-scroll font-weight-medium>
                                                    <span class="text-no-wrap text-capitalize">{{ cd.paymentMethod }}</span>
                                                </v-flex>
                                                <v-flex xs3>
                                                    <span>{{ cd.paidAmount }}</span>
                                                </v-flex>
                                                <v-flex xs2>
                                                    <v-icon :disabled="type != null" @click="paymentModalIndex = index;modalPrePayment = true;">edit</v-icon>
                                                </v-flex>
                                            </v-layout>
                                            <v-divider v-if="index < itemDetails.length - 2"></v-divider>
                                        </v-flex>
                                    </v-layout>
                                </v-card-text>
                            </v-card>
                            <v-layout mt-2 align-left justify-start row wrap overflow-x-hidden>
                                <v-flex v-if="type == null" xs12>
                                    <v-btn round dark @click="modalPrePayment = true;" class="width-90">Add Payment</v-btn>
                                </v-flex>
                            </v-layout>
                        </v-flex>
                    </v-layout>
                    <v-layout px-2 mt-3 justify-end>
                        <v-flex v-if="billDetail.receivable > 0" xs12 sm6>
                            <v-layout align-center justify-end row wrap>
                                <v-flex v-if="biggerScreen" xs12 sm5 class="text-lg-left">
                                    <label class="font-15 font-weight-regular">Due Date: </label>
                                </v-flex>
                                <v-flex xs12 sm7>
                                    <v-dialog ref="dialogduedate" v-model="modalduedate" :return-value.sync="billDetail.dueDate"
                                        persistent lazy full-width width="290px">
                                        <template v-slot:activator="{ on }">
                                            <v-text-field :disabled="type != null" v-model="billDetail.dueDate" :single-line="biggerScreen"
                                                readonly v-on="on" height=20></v-text-field>
                                        </template>
                                        <v-date-picker v-model="billDetail.dueDate" scrollable>
                                            <v-spacer></v-spacer>
                                            <v-btn flat color="primary" @click="modalduedate = false">Cancel</v-btn>
                                            <v-btn flat color="primary" @click="$refs.dialogduedate.save(billDetail.dueDate)">OK</v-btn>
                                        </v-date-picker>
                                    </v-dialog>
                                </v-flex>
                            </v-layout>
                        </v-flex>
                    </v-layout>
                    <v-layout px-2 justify-end>
                        <v-flex xs12 sm6>
                            <v-layout align-center justify-end row wrap>
                                <v-flex v-if="biggerScreen" xs12 sm5 class="text-lg-left">
                                    <label class="font-15 font-weight-regular">Total Payable Amount: </label>
                                </v-flex>
                                <v-flex xs12 sm7>
                                    <v-text-field type="number" v-model.number="billDetail.receivable" label="Total Payable Amount"
                                        :single-line="biggerScreen" height=20 disabled></v-text-field>
                                </v-flex>
                            </v-layout>
                        </v-flex>
                    </v-layout>
                    <v-layout justify-end>
                        <v-btn v-if="id == null" type="submit" :loading="btnLoading" dark round color="info">Add Bill</v-btn>
                        <v-btn v-else-if="id != null && type == null" type="submit" dark round color="info">Update Bill</v-btn>
                    </v-layout>
                </v-container>
                </v-card-title>
                </v-card>
            </v-form>
        </v-flex>
        <!-- Modals -->
        <v-dialog v-if="itemDetails.length > 0" v-model="modalPreItem" fullscreen hide-overlay transition="dialog-bottom-transition">
            <v-card>
                <v-toolbar dark color="primary">
                    <v-btn icon dark @click="modalPreItem = false;resetItemModal(itemModalDetails.length - 1)">
                        <v-icon>close</v-icon>
                    </v-btn>
                    <v-toolbar-title>Add Item</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-toolbar-items>
                        <v-btn dark flat v-if="itemModalIndex == (itemModalDetails.length - 1)" @click="itemInsertModal(itemModalIndex)">Add
                            Item</v-btn>
                        <v-btn dark flat v-else @click="itemEditModal(itemModalIndex)">Update Item</v-btn>
                    </v-toolbar-items>
                </v-toolbar>
                <v-container grid-list-md>
                    <v-layout wrap>
                        <v-flex xs12>
                            <v-autocomplete v-if="itemModalDetails[itemModalIndex].check == 1" v-model="itemModalDetails[itemModalIndex].itemId"
                                @input="itemModalGenerate(itemModalIndex)" append-icon="search" :items="itemsModalACVitems"
                                :loading="itemsModalACV.isLoading" :search-input.sync="itemsModalACV.search" hide-no-data
                                hide-selected item-text="name" item-value="id" label="Item Name" placeholder="Item Name"
                                return-string height=20></v-autocomplete>
                            <v-text-field v-else v-model="itemModalDetails[itemModalIndex].itemName" height=20 disabled></v-text-field>
                        </v-flex>
                        <v-flex xs12>
                            <v-text-field type="text" v-model="itemModalDetails[itemModalIndex].unitName" label="Unit"
                                height=20 disabled></v-text-field>
                        </v-flex>
                        <v-flex xs12>
                            <v-text-field type="number" v-model="itemModalDetails[itemModalIndex].mrp" label="MRP" min="0"
                                step="any" height=20 @keyup="getSubTotalModal(itemModalIndex)" @change="getSubTotalModal(itemModalIndex)"></v-text-field>
                        </v-flex>
                        <v-flex xs12 v-if="configuration.taxes == 1">
                            <v-text-field type="number" v-model="itemModalDetails[itemModalIndex].gst" label="GST"
                                height=20 disabled></v-text-field>
                        </v-flex>
                        <v-flex xs12>
                            <v-text-field type="number" min="1" :disabled="itemModalDetails[itemModalIndex].id != null"
                                v-model.number="itemModalDetails[itemModalIndex].quantity" @change="getSubTotalModal(itemModalIndex)"
                                @keyup="getSubTotalModal(itemModalIndex)" label="Quantity" height=20></v-text-field>
                        </v-flex>
                        <v-flex xs12>
                            <v-text-field type="number" v-model="itemModalDetails[itemModalIndex].subTotal" label="Sub Total"
                                height=20 disabled></v-text-field>
                        </v-flex>
                        <v-flex xs12>
                            <v-layout justify-end>
                                <v-btn dark round v-if="itemModalIndex == (itemModalDetails.length - 1)" @click="itemInsertModal(itemModalIndex)">Add
                                    Item</v-btn>
                                <v-btn dark round v-else @click="itemEditModal(itemModalIndex)">Update Item</v-btn>
                            </v-layout>
                        </v-flex>
                    </v-layout>
                </v-container>
            </v-card>
        </v-dialog>
        <v-dialog v-if="payment.length-1 > 0" v-model="modalPrePayment" fullscreen hide-overlay transition="dialog-bottom-transition">
            <v-card>
                <v-toolbar dark color="primary">
                    <v-btn icon dark @click="modalPrePayment = false;paymentModalIndex = (payment.length - 1)">
                        <v-icon>close</v-icon>
                    </v-btn>
                    <v-toolbar-title>Add Payment</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-toolbar-items>
                        <v-btn dark flat v-if="paymentModalIndex == (payment.length - 1)" @click="modalPrePayment = false;paymentAdd(paymentModalIndex);getReceviable();paymentModalIndex = payment.length - 1">Add
                            Payment</v-btn>
                        <v-btn dark flat v-else @click="modalPrePayment = false;getReceviable();paymentModalIndex = payment.length - 1">Update
                            Payment</v-btn>
                    </v-toolbar-items>
                </v-toolbar>
                <v-container grid-list-md>
                    <v-layout wrap>
                        <v-flex xs12>
                            <v-dialog ref="modaldudate" v-model="payment[paymentModalIndex].modalduedate"
                                :return-value.sync="payment[paymentModalIndex].dueDate" persistent lazy full-width
                                width="290px">
                                <template v-slot:activator="{ on }">
                                    <v-text-field v-model="payment[paymentModalIndex].dueDate" readonly v-on="on"
                                        height=20></v-text-field>
                                </template>
                                <v-date-picker v-model="payment[paymentModalIndex].dueDate" scrollable>
                                    <v-spacer></v-spacer>
                                    <v-btn flat color="primary" @click="payment[paymentModalIndex].modalduedate = false">Cancel</v-btn>
                                    <v-btn flat color="primary" @click="$refs.modaldudate.save(payment[paymentModalIndex].dueDate)">OK</v-btn>
                                </v-date-picker>
                            </v-dialog>
                        </v-flex>
                        <v-flex xs12>
                            <v-select :items="['Cash','Cheque','Wallet','Card','other']" label="Payment Method" v-model="payment[paymentModalIndex].paymentMethod"
                                height=20></v-select>
                        </v-flex>
                        <v-flex xs12>
                            <v-text-field height=20 v-model="payment[paymentModalIndex].notes" label="Notes"></v-text-field>
                        </v-flex>
                        <v-flex xs12>
                            <v-text-field type="number" v-model="payment[paymentModalIndex].paidAmount" label="Recieved Amount"
                                min="0" @keyup="getReceviable()" @change="getReceviable()" :disabled="payment[paymentModalIndex].id != null"
                                height=20></v-text-field>
                        </v-flex>
                        <v-flex xs12>
                            <v-layout justify-end>
                                <v-btn dark round v-if="paymentModalIndex == (payment.length - 1)" @click="modalPrePayment = false;paymentAdd(paymentModalIndex);getReceviable();paymentModalIndex = payment.length - 1">Add
                                    Payment</v-btn>
                                <v-btn dark round v-else @click="modalPrePayment = false;getReceviable();paymentModalIndex = payment.length - 1">Update
                                    Payment</v-btn>
                            </v-layout>
                        </v-flex>
                    </v-layout>
                </v-container>
            </v-card>
        </v-dialog>
    </v-layout>
</template>
<script>
    import loadercontent from "@/components/loadercontent";
    export default {
        props: {
            id: {
                type: String,
                required: false
            },
            type: {
                type: String,
                required: false
            }
        },
        components:{
            loadercontent
        },
        data: () => ({
            loader1:true,
            loader2:true,
            loader3:true,
            btnLoading:false,
            biggerScreen: true,
            valid: false,
            requiredRules: [
                v => !!v || 'This Field is required'
            ],
            descriptionLimit: 60,
            modalbilldate: false,
            modalpos: false,
            modalduedate: false,
            supplierACV: {
                isLoading: false,
                search: null,
                entries: []
            },
            itemsACV: {
                isLoading: false,
                entries: [],
                search: null
            },
            itemsModalACV: {
                isLoading: false,
                entries: [],
                search: null
            },
            date: new Date().toISOString().substr(0, 10),
            menu: false,
            modal: false,
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
            formsubmited: 0,
            modalSupplier: 0,
            modalItem: false,
            modalPreItem: false,
            modalPrePayment: false,
            configuration: {},
            paymentModalIndex: 0,
            itemModalIndex: 0,
            deleteItemId: [],
            deleteStockId: [],
            deleteItemQuantity: [],
            deletePaymentId: [],
            billPreNo: {
                billNo: ""
            },
            idToBeSent: {
                supplierId: ""
            },
            billDetail: {
                supplierName: "",
                billBookName: "",
                billDate: "",
                totalPayableAmount: 0,
                charges: 0,
                dueDate: new Date().toISOString().substr(0, 10),
                roundoff: 0,
                taxAmount: 0,
                itemTotal: 0,
                discount: 0,
                discountType: "1",
                note: "",
                receivable: 0
            },
            payment: [
                {
                    id: null,
                    dueDate: new Date().toISOString().substr(0, 10),
                    paymentMethod: "",
                    paidAmount: 0,
                    notes: "",
                    series: 0
                }
            ],
            itemModalDetails: [],
            itemDetails: []
        }),
        created() {
            if (this.id != null) {
                this.$axios.get("/" + this.$route.params.username + "/api/Purchases?access_token=" + this.$store.state.token + "&filter[where][id]=" + this.id + "&filter[where][isenabled]=1")
                    .then(res => {
                        if (res.data.length > 0){
                            this.getDetails()
                            this.itemModalIndex = 0
                        }
                        else {
                            return this.$nuxt.error({ statusCode: 404, message: "Page Not Found" })
                        }
                    })
                    .catch(e => {
                        return this.$nuxt.error({ statusCode: e.response.status, message: e.message })
                    })
            }
            else {
                this.generate();
            }
        },
        mounted() {
            this.$nextTick(() => {
                if (window.innerWidth <= 600) this.biggerScreen = false
                else this.biggerScreen = true
                window.addEventListener('resize', () => {
                    if (window.innerWidth <= 600) this.biggerScreen = false
                    else this.biggerScreen = true
                })
            })
        },
        computed: {
            supplierACVitems() {
                return this.supplierACV.entries.map(entry => {
                    const name = entry.name.length > this.descriptionLimit
                        ? entry.name.slice(0, this.descriptionLimit) + '...'
                        : entry.name
                    const id = entry.id
                    return Object.assign({}, entry, { id, name })
                })
            },
            itemsACVitems() {
                return this.itemsACV.entries.map(entry => {
                    const name = entry.name.length > this.descriptionLimit
                        ? entry.name.slice(0, this.descriptionLimit) + '...'
                        : entry.name
                    const id = entry.id
                    return Object.assign({}, entry, { id, name })
                })
            },
            itemsModalACVitems() {
                return this.itemsModalACV.entries.map(entry => {
                    const name = entry.name.length > this.descriptionLimit
                        ? entry.name.slice(0, this.descriptionLimit) + '...'
                        : entry.name
                    const id = entry.id
                    return Object.assign({}, entry, { id, name })
                })
            }
        },
        watch: {
            'supplierACV.search': function (val) {
                // Items have already been requested
                if (this.supplierACV.isLoading) return
                this.supplierACV.isLoading = true

                // Lazily load input items
                this.$axios.get('/' + this.$route.params.username + '/api/Suppliers/SupplierNames?access_token=' + this.$store.state.token + '&names=' + val)
                    .then(res => {
                        let { values } = res.data
                        this.supplierACV.entries = values
                    })
                    .catch(err => {
                        console.log(err)
                    })
                    .finally(() => (this.supplierACV.isLoading = false))
            },
            'itemsACV.search': function (val) {
                // Items have already been requested
                if (this.itemsACV.isLoading) return

                this.itemsACV.isLoading = true

                // Lazily load input items
                this.$axios.get('/' + this.$route.params.username + '/api/Items/itemNames?access_token=' + this.$store.state.token + '&names=' + val)
                    .then(res => {
                        const { values } = res.data
                        this.itemsACV.entries = values
                    })
                    .catch(err => {
                        console.log(err)
                    })
                    .finally(() => (this.itemsACV.isLoading = false))
            },
            'itemsModalACV.search': function (val) {
                // Items have already been requested
                if (this.itemsModalACV.isLoading) return

                this.itemsModalACV.isLoading = true

                // Lazily load input items
                this.$axios.get('/' + this.$route.params.username + '/api/Items/itemNames?access_token=' + this.$store.state.token + '&names=' + val)
                    .then(res => {
                        const { values } = res.data
                        this.itemsModalACV.entries = values
                    })
                    .catch(err => {
                        console.log(err)
                    })
                    .finally(() => (this.itemsModalACV.isLoading = false))
            }
        },
        methods: {
            newSupplier() {
                if (this.idToBeSent.supplierId == 0) {
                    this.modalSupplier = 1
                }
            },
            resetItemModal(index) {
                this.itemModalDetails[index].id = null
                this.itemModalDetails[index].itemId = ""
                this.itemModalDetails[index].unitName = ""
                this.itemModalDetails[index].itemName = ""
                this.itemModalDetails[index].mrp = 0
                this.itemModalDetails[index].gst = 0
                this.itemModalDetails[index].quantity = 1
                this.itemModalDetails[index].subTotal = 0
                this.itemModalDetails[index].check = 1
                this.itemModalDetails[index].taxAmount = 0
                this.itemModalDetails[index].series = 1
                this.itemModalIndex = index
            },
            getConfiguration() {
                this.$axios.get("/" + this.$route.params.username + "/api/Configurations?access_token=" + this.$store.state.token)
                    .then(res => {
                        for (let i = 0; i < res.data.length; i++) {
                            if (res.data[i].alias == "manage_transport") this.configuration.transport = res.data[i].value
                            else if (res.data[i].alias == "calculate_taxes_purchase") this.configuration.taxes = res.data[i].value
                        }
                        if (this.configuration.taxes == 0) {
                            this.itemheaders.splice(4, 1)
                        }
                        this.createItemRow()
                        this.createItemModalRow()
                    })
            },
            async getDetails() {
                this.getConfiguration()
                await this.$axios.get("/" + this.$route.params.username + "/api/Purchases/" + this.id + "/supplier?access_token=" + this.$store.state.token)
                    .then((res) => {
                        this.billDetail.supplierName = res.data.name
                    })
                await this.$axios.get("/" + this.$route.params.username + "/api/Purchases?access_token=" + this.$store.state.token + "&filter[where][id]=" + this.id)
                    .then((res) => {
                        this.idToBeSent.supplierId = res.data[0].supplierId
                        this.billDetail.billDate = new Date(res.data[0].billdate).toISOString().substr(0,10);
                        this.billDetail.dueDate = new Date(res.data[0].duedate).toISOString().substr(0,10);
                        let dis = "" + res.data[0].discount
                        if (dis.search('%') > -1) {
                            this.billDetail.discountType = '2'
                            this.billDetail.discount = parseFloat(dis.substr(0, dis.search('%')))
                        }
                        else this.billDetail.discount = parseFloat(dis)
                        this.billDetail.charges = res.data[0].charges
                        this.billDetail.totalPayableAmount = res.data[0].totalamount
                        this.billPreNo.billNo = res.data[0].billno
                        this.loader1 = false
                    })
                this.itemDetails = []
                this.itemModalDetails = []
                await this.$axios.get("/" + this.$route.params.username + "/api/Purchaseitems?access_token=" + this.$store.state.token + "&filter[where][purchaseId]=" + this.id + "&filter[order]=series&filter[include][item]=unit&filter[include][item][subType][type]=tax")
                    .then((res) => {
                        this.$axios.get("/" + this.$route.params.username + "/api/Stocklogs?access_token=" + this.$store.state.token + "&filter[where][purchaseId]=" + this.id)
                            .then(res2 => {
                                for (let i = 0; i < res.data.length; i++) {
                                    for (let j = 0; j < res2.data.length; j++) {
                                        if (res.data[i].itemId == res2.data[j].itemId && res.data[i].quantity == res2.data[j].quantity) {
                                            if (this.configuration.taxes == 0) {
                                                this.itemDetails.push({
                                                    id: res.data[i].id,
                                                    itemId: res.data[i].itemId,
                                                    stockId: res2.data[j].id,
                                                    unitName: res.data[i].item.unit.title,
                                                    itemName: res.data[i].item.name,
                                                    mrp: res.data[i].itemprice,
                                                    gst: 0,
                                                    quantity: res.data[i].quantity,
                                                    subTotal: 0,
                                                    check: 0,
                                                    taxAmount: 0,
                                                    series: res.data[i].series
                                                })
                                            }
                                            else {
                                                this.itemDetails.push({
                                                    id: res.data[i].id,
                                                    itemId: res.data[i].itemId,
                                                    stockId: res2.data[j].id,
                                                    unitName: res.data[i].item.unit.title,
                                                    itemName: res.data[i].item.name,
                                                    mrp: res.data[i].itemprice,
                                                    gst: res.data[i].item.subType.type.tax.percentage,
                                                    quantity: res.data[i].quantity,
                                                    subTotal: 0,
                                                    check: 0,
                                                    taxAmount: 0,
                                                    series: res.data[i].series
                                                })
                                            }
                                            if (this.configuration.taxes == 0) {
                                                this.itemModalDetails.push({
                                                    id: res.data[i].id,
                                                    itemId: res.data[i].itemId,
                                                    stockId: res2.data[j].id,
                                                    unitName: res.data[i].item.unit.title,
                                                    itemName: res.data[i].item.name,
                                                    mrp: res.data[i].itemprice,
                                                    gst: 0,
                                                    quantity: res.data[i].quantity,
                                                    subTotal: 0,
                                                    check: 0,
                                                    taxAmount: 0,
                                                    series: res.data[i].series
                                                })
                                            }
                                            else {
                                                this.itemModalDetails.push({
                                                    id: res.data[i].id,
                                                    itemId: res.data[i].itemId,
                                                    stockId: res2.data[j].id,
                                                    unitName: res.data[i].item.unit.title,
                                                    itemName: res.data[i].item.name,
                                                    mrp: res.data[i].itemprice,
                                                    gst: res.data[i].item.subType.type.tax.percentage,
                                                    quantity: res.data[i].quantity,
                                                    subTotal: 0,
                                                    check: 0,
                                                    taxAmount: 0,
                                                    series: res.data[i].series
                                                })
                                            }
                                            this.getSubTotal(i)
                                            this.getSubTotalModal(i)
                                            break;
                                        }
                                    }
                                }
                                if (this.type != null && this.biggerScreen == true);
                                else {
                                    this.createItemRow()
                                    this.createItemModalRow()
                                    this.itemModalIndex = this.itemModalDetails.length - 1
                                    this.paymentModalIndex = this.payment.length - 1
                                }
                                this.loader2 = false
                            })
                    })
                this.$axios.get("/" + this.$route.params.username + "/api/Purchasepayments?access_token=" + this.$store.state.token + "&filter[where][purchaseId]=" + this.id + "&filter[purchase]=series")
                    .then((res) => {
                        this.payment = []
                        for (let i = 0; i < res.data.length; i++) {
                            let date = new Date(res.data[i].paymentdate);
                            let month = "" + (date.getMonth() + 1)
                            let date1 = "" + (date.getDate())
                            if ((date.getMonth() + 1) < 10) month = "0" + (date.getMonth() + 1)
                            if (date.getDate() < 10) date1 = "0" + date.getDate()
                            this.payment.push({
                                id: res.data[i].id,
                                dueDate: date.getFullYear() + "-" + month + '-' + date1,
                                paymentMethod: res.data[i].paymentmethod,
                                paidAmount: res.data[i].paidamount,
                                notes: res.data[i].notes,
                                series: res.data[i].series
                            })
                            this.getReceviable()
                        }
                        if (this.type != null && this.biggerScreen == true);
                        else {
                            this.createPaymentRow()
                        }
                        this.loader3 = false
                    })
            },
            itemInsertModal(index) {
                this.itemDetails.pop()
                this.itemModalDetails[index].series = index
                this.itemDetails.push(this.itemModalDetails[index])
                this.modalPreItem = false
                this.getBillTotal()
                this.createItemModalRow()
                this.createItemRow()
                this.itemModalIndex = this.itemModalDetails.length - 1
            },
            itemEditModal(index) {
                this.itemModalDetails[index].series = index
                this.itemDetails[index] = this.itemModalDetails[index]
                this.modalPreItem = false
                this.getBillTotal()
                this.itemModalIndex = this.itemModalDetails.length - 1
            },
            getSubTotalModal(index) {
                let mrp = parseFloat(this.itemModalDetails[index].mrp);
                let gst = parseFloat(this.itemModalDetails[index].gst);
                let qty = parseFloat(this.itemModalDetails[index].quantity);
                this.itemModalDetails[index].taxAmount = ((parseFloat(mrp * qty) * gst) / 100);
                let tax = this.itemModalDetails[index].taxAmount
                this.itemModalDetails[index].subTotal = parseFloat((mrp * qty) + tax).toFixed(2);
            },
            getSubTotal(index) {
                let mrp = parseFloat(this.itemDetails[index].mrp);
                let gst = parseFloat(this.itemDetails[index].gst);
                let qty = parseFloat(this.itemDetails[index].quantity);
                this.itemDetails[index].taxAmount = ((parseFloat(mrp * qty) * gst) / 100);
                let tax = this.itemDetails[index].taxAmount
                this.itemDetails[index].subTotal = parseFloat((mrp * qty) + tax).toFixed(2);
                this.getBillTotal()

            },
            getBillTotal() {
                let amount = 0
                let totalTax = 0
                for (let i = 0; i < this.itemDetails.length; i++) {
                    amount += parseFloat(this.itemDetails[i].subTotal)
                    totalTax += parseFloat(this.itemDetails[i].taxAmount)
                }
                this.billDetail.taxAmount = totalTax
                this.billDetail.itemTotal = amount
                if (this.billDetail.discountType == "1") {
                    amount = amount + parseFloat(this.billDetail.charges) - parseFloat(this.billDetail.discount)
                }
                else {
                    let dis = (amount * this.billDetail.discount) / 100
                    amount = amount + parseFloat(this.billDetail.charges) - parseFloat(dis)
                }
                let val = Math.round(amount)
                this.billDetail.roundoff = parseFloat(val - amount).toFixed(2)
                this.billDetail.totalPayableAmount = val
                this.billDetail.receivable = val
                this.getReceviable()
            },
            getReceviable() {
                let amount = parseFloat(this.billDetail.totalPayableAmount)
                for (let i = 0; i < this.payment.length; i++) {
                    if (this.payment[i].paymentMethod != "") {
                        amount -= this.payment[i].paidAmount
                    }
                }
                this.billDetail.receivable = amount
            },
            paymentAdd(index) {
                this.payment[index].series = index
                let v = 0
                for (let i = 0; i < this.payment.length; i++) {
                    v = 0
                    if (this.payment[i].paymentMethod == "") {
                        v = 1
                        break;
                    }
                }
                if (v == 0) {
                    this.createPaymentRow()

                    this.getReceviable()
                }
            },
            createItemModalRow() {
                this.itemModalDetails.push({
                    id: null,
                    itemId: "",
                    stockId: null,
                    unitName: "",
                    itemName: "",
                    mrp: 0,
                    gst: 0,
                    quantity: 1,
                    subTotal: 0,
                    check: 1,
                    taxAmount: 0
                })
            },
            createItemRow() {
                this.itemDetails.push({
                    id: null,
                    itemId: "",
                    stockId: null,
                    unitName: "",
                    itemName: "",
                    mrp: 0,
                    gst: 0,
                    quantity: 1,
                    subTotal: 0,
                    check: 1,
                    taxAmount: 0
                })
            },
            createPaymentRow() {
                let date = new Date();
                let month = "" + (date.getMonth() + 1)
                let date1 = "" + (date.getDate())
                if ((date.getMonth() + 1) < 10) month = "0" + (date.getMonth() + 1)
                if (date.getDate() < 10) date1 = "0" + date.getDate()
                this.payment.push({
                    id: null,
                    dueDate: date.getFullYear() + "-" + month + '-' + date1,
                    paymentMethod: "",
                    paidAmount: 0,
                    notes: "",
                    series: 0
                })
            },
            removeItemRow(index) {
                if (this.itemDetails.length > 1) {
                    if (this.itemDetails[index].id != null) {
                        this.deleteItemQuantity.push(this.itemDetails[index].quantity)
                        this.deleteItemId.push(this.itemDetails[index].id)
                    }
                    if (this.itemDetails[index].stockId != null) this.deleteStockId.push(this.itemDetails[index].stockId)
                    this.itemDetails.splice(index, 1)
                    this.getBillTotal()
                }
            },
            removeItemModalRow(index) {
                if (this.itemModalDetails.length > 1) {
                    if (this.itemModalDetails[index].id != null) this.deleteItemId.push(this.itemModalDetails[index].id)
                    if (this.itemModalDetails[index].stockId != null) this.deleteStockId.push(this.itemModalDetails[index].stockId)
                    this.itemModalDetails.splice(index, 1)
                    this.getBillTotal()
                    this.itemModalIndex = 0
                }
            },
            removePaymentRow(index) {

                if (this.payment[index].id != null) this.deletePaymentId.push(this.payment[index].id)
                this.payment.splice(index, 1)
                this.getReceviable()
                this.paymentModalIndex = 0
            },
            supplierAmount() {
                return new Promise((resolve, reject) => {
                    if (this.id == null) {
                        this.$axios.get("/" + this.$route.params.username + "/api/Suppliers/" + this.idToBeSent.supplierId + "?access_token=" + this.$store.state.token)
                            .then(response => {
                                let tamount = parseFloat(response.data.totalamount)
                                let paid = parseFloat(response.data.paid)
                                tamount += this.billDetail.totalPayableAmount
                                paid += (this.billDetail.totalPayableAmount - this.billDetail.receivable)
                                this.$axios.post("/" + this.$route.params.username + "/api/Suppliers/update?access_token=" + this.$store.state.token + "&where[id]=" + this.idToBeSent.supplierId, {
                                    totalamount: tamount,
                                    paid: paid
                                })
                                    .then(res => {
                                        resolve("done")
                                    })
                            })
                    }
                    else {
                        this.$axios.get("/" + this.$route.params.username + "/api/Purchases/" + this.id + "?access_token=" + this.$store.state.token + "&filter[include]=supplier")
                            .then(response => {
                                let recpre = 0
                                this.$axios.get("/" + this.$route.params.username + "/api/purchasepayments?access_token=" + this.$store.state.token + "&filter[where][purchaseId]=" + this.id)
                                    .then(res => {
                                        for (let i = 0; i < res.data.length; i++) {
                                            recpre += parseFloat(res.data[i].paidamount)
                                        }
                                        let tamount = parseFloat(response.data.supplier.totalamount) - parseFloat(response.data.totalamount)
                                        let paid = parseFloat(response.data.supplier.paid) - parseFloat(recpre)
                                        tamount += this.billDetail.totalPayableAmount
                                        paid += (this.billDetail.totalPayableAmount - this.billDetail.receivable)
                                        this.$axios.post("/" + this.$route.params.username + "/api/Suppliers/update?access_token=" + this.$store.state.token + "&where[id]=" + this.idToBeSent.supplierId, {
                                            totalamount: tamount,
                                            paid: paid
                                        })
                                            .then(res1 => {
                                                resolve("done")
                                            })
                                    })
                            })
                    }
                })
            },
            itemModalGenerate(index) {
                if (this.itemModalDetails[index].itemId == 0) this.modalItem = true
                else {
                    this.$axios.get("/" + this.$route.params.username + "/api/Items/" + this.itemModalDetails[index].itemId + "?access_token=" + this.$store.state.token)
                        .then(res => {
                            this.itemModalDetails[index].itemName = res.data.name;
                            this.itemModalDetails[index].mrp = res.data.price;
                            this.$axios.get("/" + this.$route.params.username + "/api/Items/" + this.itemModalDetails[index].itemId + "/unit?access_token=" + this.$store.state.token)
                                .then(res1 => {
                                    this.itemModalDetails[index].unitName = res1.data.title;
                                    this.$axios.get("/" + this.$route.params.username + "/api/Items/" + this.itemModalDetails[index].itemId + "/subType/type?access_token=" + this.$store.state.token)
                                        .then(res2 => {
                                            this.$axios.get("/" + this.$route.params.username + "/api/Types/" + res2.data.id + "/tax?access_token=" + this.$store.state.token)
                                                .then(res3 => {
                                                    if (this.configuration.taxes == 1) this.itemModalDetails[index].gst = res3.data.percentage;
                                                    this.itemModalDetails[index].check = 0;
                                                    this.getSubTotalModal(index)
                                                });
                                        });
                                });
                        });
                }
            },
            async generate() {
                this.billDetail.billDate = new Date().toISOString().substr(0,10);
                this.getConfiguration()
                this.loader1 = false;
                this.loader2 = false
                this.loader3 = false
            },
            async itemGenerate(index) {
                if (this.itemDetails[index].itemId == 0) this.modalItem = true
                else {
                    await this.$axios.get("/" + this.$route.params.username + "/api/Items/" + this.itemDetails[index].itemId + "?access_token=" + this.$store.state.token)
                        .then(res => {
                            this.itemDetails[index].itemName = res.data.name;
                            this.itemDetails[index].mrp = res.data.price;
                            this.$axios.get("/" + this.$route.params.username + "/api/Items/" + this.itemDetails[index].itemId + "/unit?access_token=" + this.$store.state.token)
                                .then(res1 => {
                                    this.itemDetails[index].unitName = res1.data.title;
                                    this.$axios.get("/" + this.$route.params.username + "/api/Items/" + this.itemDetails[index].itemId + "/subType/type?access_token=" + this.$store.state.token)
                                        .then(res2 => {
                                            this.$axios.get("/" + this.$route.params.username + "/api/Types/" + res2.data.id + "/tax?access_token=" + this.$store.state.token)
                                                .then(res3 => {
                                                    if (this.configuration.taxes == 1) this.itemDetails[index].gst = res3.data.percentage;
                                                    this.itemDetails[index].check = 0;
                                                    this.itemDetails[index].series = index
                                                    this.getSubTotal(index)
                                                    this.getBillTotal()
                                                });
                                        });
                                });
                        });
                    let v = 0
                    for (let i = 0; i < this.itemDetails.length; i++) {
                        v = 0
                        if (this.itemDetails[i].itemId == "") {
                            v = 1
                            break;
                        }
                    }
                    if (v == 0) {
                        this.createItemRow()
                    }
                }
            },
            async addBill() {
                if (this.$refs.form.validate()) {
                    this.btnLoading=true;
                    this.formsubmited = 1
                    if (this.id == null) {
                        let disamount = this.billDetail.discount
                        if (this.billDetail.discountType == '2') disamount += '%'
                        let paidamount = parseFloat(this.billDetail.totalPayableAmount) - parseFloat(this.billDetail.receivable)
                        await this.$axios.post("/" + this.$route.params.username + "/api/Purchases?access_token=" + this.$store.state.token,
                            {
                                itemtotal: this.billDetail.itemTotal,
                                discount: disamount,
                                charges: this.billDetail.charges,
                                taxamount: this.billDetail.taxAmount,
                                roundoff: this.billDetail.roundoff,
                                billno: this.billPreNo.billNo,
                                totalamount: this.billDetail.totalPayableAmount,
                                paidamount: paidamount,
                                pendingamount: this.billDetail.receivable,
                                gstin: "123",
                                billdate: this.billDetail.billDate,
                                duedate: this.billDetail.dueDate,
                                createdon: new Date(new Date().getTime() - (new Date().getTimezoneOffset() * 60000)).toISOString(),
                                modifiedon: new Date(new Date().getTime() - (new Date().getTimezoneOffset() * 60000)).toISOString(),
                                supplierId: this.idToBeSent.supplierId,
                                createdById: this.$store.state.userId,
                                modifiedById: this.$store.state.userId
                            }
                        ).then(res => {
                            this.supplierAmount()
                            let purchaseItem = []
                            let j = 0;
                            this.$axios.post("/" + this.$route.params.username + "/api/Purchases/usedstockcal?access_token=" + this.$store.state.token,
                                {
                                    itemId: this.itemDetails,
                                    itemquantity: null,
                                    type: "add"
                                });
                            for (let i = 0; i < this.itemDetails.length; i++) {
                                if (this.itemDetails[i].itemId != "") {
                                    purchaseItem[j] = new Object();
                                    purchaseItem[j].purchaseId = res.data.id
                                    purchaseItem[j].itemId = this.itemDetails[i].itemId
                                    purchaseItem[j].quantity = this.itemDetails[i].quantity
                                    purchaseItem[j].itemprice = this.itemDetails[i].mrp
                                    purchaseItem[j].taxprice = this.itemDetails[i].taxAmount
                                    purchaseItem[j].series = this.itemDetails[i].series
                                    j++
                                }
                            }
                            this.$axios.post("/" + this.$route.params.username + "/api/Purchaseitems?access_token=" + this.$store.state.token, purchaseItem)
                                .then(res1 => {
                                    let purchaseStock = []
                                    let k = 0
                                    for (let i = 0; i < this.itemDetails.length; i++) {
                                        if (this.itemDetails[i].itemId != "") {
                                            purchaseStock[k] = new Object();
                                            purchaseStock[k].itemId = this.itemDetails[i].itemId
                                            purchaseStock[k].purchaseId = res.data.id
                                            purchaseStock[k].price = this.itemDetails[i].mrp
                                            purchaseStock[k].date = this.billDetail.billDate
                                            purchaseStock[k].quantity = this.itemDetails[i].quantity
                                            purchaseStock[k].createdon = new Date(new Date().getTime() - (new Date().getTimezoneOffset() * 60000)).toISOString()
                                            purchaseStock[k].modifiedon = new Date(new Date().getTime() - (new Date().getTimezoneOffset() * 60000)).toISOString()
                                            purchaseStock[k].createdById = this.$store.state.userId
                                            purchaseStock[k].modifiedById = this.$store.state.userId
                                            k++
                                        }
                                    }
                                    this.$axios.post("/" + this.$route.params.username + "/api/Stocklogs?access_token=" + this.$store.state.token, purchaseStock)
                                        .then(res5 => {
                                            let payment
                                            if (this.payment.length <= 0) {
                                                this.$router.push("/" + this.$route.params.username + "/Dashboard/purchase/order/" + res.data.id + "/view");
                                            }
                                            else {
                                                payment = []
                                                let j = 0
                                                for (let i = 0; i < this.payment.length; i++) {
                                                    if (this.payment[i].paymentMethod != "" && this.payment[i].paidAmount > 0) {
                                                        payment[j] = new Object()
                                                        payment[j].paymentmethod = this.payment[i].paymentMethod
                                                        payment[j].paidamount = this.payment[i].paidAmount
                                                        payment[j].notes = this.payment[i].notes
                                                        payment[j].series = this.payment[i].series
                                                        payment[j].paymentdate = new Date()
                                                        payment[j].createdon = new Date(new Date().getTime() - (new Date().getTimezoneOffset() * 60000)).toISOString()
                                                        payment[j].modifiedon = new Date(new Date().getTime() - (new Date().getTimezoneOffset() * 60000)).toISOString()
                                                        payment[j].createdById = this.$store.state.userId
                                                        payment[j].modifiedById = this.$store.state.userId
                                                        payment[j].purchaseId = res.data.id
                                                        j++
                                                    }
                                                }
                                            }

                                            this.$axios.post("/" + this.$route.params.username + "/api/Purchasepayments?access_token=" + this.$store.state.token, payment)
                                                .then(res2 => {
                                                    this.$router.push("/" + this.$route.params.username + "/Dashboard/purchase/order/" + res.data.id + "/view")
                                                });
                                        })
                                });
                        });
                    }
                    else {
                        this.supplierAmount()
                            .then((resolve) => {
                                let disamount = this.billDetail.discount
                                if (this.billDetail.discountType == '2') disamount += '%'
                                this.$axios.post("/" + this.$route.params.username + "/api/Purchases/update?where[id]=" + this.id + "&access_token=" + this.$store.state.token, {
                                    itemtotal: this.billDetail.itemTotal,
                                    discount: disamount,
                                    charges: this.billDetail.charges,
                                    taxamount: this.billDetail.taxAmount,
                                    roundoff: this.billDetail.roundoff,
                                    billno: this.billPreNo.billNo,
                                    totalamount: this.billDetail.totalPayableAmount,
                                    paidamount: parseFloat(this.billDetail.totalPayableAmount) - parseFloat(this.billDetail.receivable),
                                    pendingamount: this.billDetail.receivable,
                                    gstin: "123",
                                    billdate: this.billDetail.billDate,
                                    duedate: this.billDetail.dueDate,
                                    modifiedon: new Date(new Date().getTime() - (new Date().getTimezoneOffset() * 60000)).toISOString(),
                                    modifiedById: this.$store.state.userId
                                })
                                    .then(res => {
                                        let purchaseItem = []
                                        let j = 0
                                        let promise4 = new Promise((resolve, reject) => {
                                            if (this.deleteItemQuantity.length > 0) {
                                                this.$axios.post("/" + this.$route.params.username + "/api/Purchases/usedstockcal?access_token=" + this.$store.state.token,
                                                    {
                                                        itemId: this.deleteItemId,
                                                        itemquantity: this.deleteItemQuantity,
                                                        type: 'sub'
                                                    })
                                                    .then(res => {
                                                        resolve()
                                                    })
                                            }
                                            else resolve("done")
                                        })
                                        promise4.then((resolve) => {
                                            this.$axios.post("/" + this.$route.params.username + "/api/Purchases/usedstockcal?access_token=" + this.$store.state.token,
                                                {
                                                    itemId: this.itemDetails,
                                                    itemquantity: null,
                                                    type: "add"
                                                })
                                                .then(res => {
                                                    for (let i = 0; i < this.itemDetails.length; i++) {
                                                        if (this.itemDetails[i].itemId != "") {
                                                            if (this.itemDetails[i].id == null) {
                                                                purchaseItem[j] = new Object();
                                                                purchaseItem[j].purchaseId = this.id
                                                                purchaseItem[j].itemId = this.itemDetails[i].itemId
                                                                purchaseItem[j].quantity = this.itemDetails[i].quantity
                                                                purchaseItem[j].itemprice = this.itemDetails[i].mrp
                                                                purchaseItem[j].taxprice = this.itemDetails[i].taxAmount
                                                                purchaseItem[j].series = this.itemDetails[i].series
                                                                j++
                                                            }
                                                        }
                                                    }
                                                    this.$axios.post("/" + this.$route.params.username + "/api/Purchases/usedstockcal?access_token=" + this.$store.state.token,
                                                        {
                                                            itemId: this.itemDetails,
                                                            itemquantity: null,
                                                            type: "update"
                                                        })
                                                        .then(res => {
                                                            for (let i = 0; i < this.deleteItemId.length; i++) this.$axios.delete("/" + this.$route.params.username + "/api/Purchaseitems/" + this.deleteItemId[i] + "?access_token=" + this.$store.state.token)
                                                            this.$axios.post("/" + this.$route.params.username + "/api/Stocklogs/stockinsert?access_token=" + this.$store.state.token,
                                                                {
                                                                    stockId: this.deleteStockId,
                                                                    userId: this.$store.state.userId
                                                                })
                                                                .then(res => {
                                                                    this.$axios.post("/" + this.$route.params.username + "/api/Purchaseitems?access_token=" + this.$store.state.token, purchaseItem)
                                                                        .then(res => {
                                                                            let purchaseStock = []
                                                                            let k = 0
                                                                            for (let i = 0; i < this.itemDetails.length; i++) {
                                                                                if (this.itemDetails[i].itemId != "") {
                                                                                    if (this.itemDetails[i].stockId == null) {
                                                                                        purchaseStock[k] = new Object();
                                                                                        purchaseStock[k].itemId = this.itemDetails[i].itemId
                                                                                        purchaseStock[k].purchaseId = this.id
                                                                                        purchaseStock[k].price = this.itemDetails[i].mrp
                                                                                        purchaseStock[k].date = this.billDetail.billDate
                                                                                        purchaseStock[k].quantity = this.itemDetails[i].quantity
                                                                                        purchaseStock[k].createdon = new Date(new Date().getTime() - (new Date().getTimezoneOffset() * 60000)).toISOString()
                                                                                        purchaseStock[k].modifiedon = new Date(new Date().getTime() - (new Date().getTimezoneOffset() * 60000)).toISOString()
                                                                                        purchaseStock[k].createdById = this.$store.state.userId
                                                                                        purchaseStock[k].modifiedById = this.$store.state.userId
                                                                                        k++
                                                                                    }
                                                                                    else {
                                                                                        this.$axios.post("/" + this.$route.params.username + "/api/Stocklogs/update?where[id]=" + this.itemDetails[i].stockId + "&access_token=" + this.$store.state.token, {
                                                                                            quantity: this.itemDetails[i].quantity,
                                                                                            price: this.itemDetails[i].mrp,
                                                                                            modifiedon: new Date(new Date().getTime() - (new Date().getTimezoneOffset() * 60000)).toISOString(),
                                                                                            modifiedById: this.$store.state.userId
                                                                                        })
                                                                                    }
                                                                                }
                                                                            }
                                                                            this.$axios.post("/" + this.$route.params.username + "/api/Stocklogs?access_token=" + this.$store.state.token, purchaseStock)
                                                                                .then(res5 => {
                                                                                    let payment
                                                                                    if (this.payment.length <= 0) {
                                                                                        for (let i = 0; i < this.deletePaymentId.length; i++) this.$axios.delete("/" + this.$route.params.username + "/api/Purchasepayments/" + this.deletePaymentId[i] + "?access_token=" + this.$store.state.token)
                                                                                        this.$router.push("/" + this.$route.params.username + "/Dashboard/purchase/order/" + this.id + "/view")
                                                                                    }
                                                                                    else {
                                                                                        payment = []
                                                                                        let j = 0
                                                                                        for (let i = 0; i < this.payment.length; i++) {
                                                                                            if (this.payment[i].id == null) {
                                                                                                if (this.payment[i].paymentMethod != "" && this.payment[i].paidAmount > 0) {
                                                                                                    payment[j] = new Object()
                                                                                                    payment[j].paymentmethod = this.payment[i].paymentMethod
                                                                                                    payment[j].paidamount = this.payment[i].paidAmount
                                                                                                    payment[j].notes = this.payment[i].notes
                                                                                                    payment[j].series = this.payment[i].series
                                                                                                    payment[j].paymentdate = this.payment[i].dueDate
                                                                                                    payment[j].createdon = new Date(new Date().getTime() - (new Date().getTimezoneOffset() * 60000)).toISOString()
                                                                                                    payment[j].modifiedon = new Date(new Date().getTime() - (new Date().getTimezoneOffset() * 60000)).toISOString()
                                                                                                    payment[j].createdById = this.$store.state.userId
                                                                                                    payment[j].modifiedById = this.$store.state.userId
                                                                                                    payment[j].purchaseId = this.id
                                                                                                    j++
                                                                                                }
                                                                                            }
                                                                                            else {
                                                                                                this.$axios.post("/" + this.$route.params.username + "/api/Purchasepayments/update?where[id]=" + this.payment[i].id + "&access_token=" + this.$store.state.token, {
                                                                                                    paymentmethod: this.payment[i].paymentMethod,
                                                                                                    notes: this.payment[i].notes,
                                                                                                    series: this.payment[i].series,
                                                                                                    paymentdate: this.payment[i].dueDate,
                                                                                                    modifiedon: new Date(new Date().getTime() - (new Date().getTimezoneOffset() * 60000)).toISOString(),
                                                                                                    modifiedById: this.$store.state.userId
                                                                                                })
                                                                                            }
                                                                                        }

                                                                                        for (let i = 0; i < this.deletePaymentId.length; i++) this.$axios.delete("/" + this.$route.params.username + "/api/Purchasepayments/" + this.deletePaymentId[i] + "?access_token=" + this.$store.state.token)
                                                                                        this.$axios.post("/" + this.$route.params.username + "/api/Purchasepayments?access_token=" + this.$store.state.token, payment)
                                                                                            .then(res => {
                                                                                                this.$router.push("/" + this.$route.params.username + "/Dashboard/purchase/order/" + this.id + "/view")
                                                                                            })
                                                                                    }
                                                                                })
                                                                        })
                                                                })
                                                        })
                                                })
                                        })
                                    })
                            })
                    }
                }
            }
        }
    }
</script>
<style>
    .font-15 {
        font-size: 15px
    }

    .font-13 {
        font-size: 13px
    }

    .overflow-x-scroll {
        overflow-x: scroll
    }

    .width-90 {
        width: 90%
    }
</style>