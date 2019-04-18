<template>
    <div>
        <div :class="[Orderitems.length > 5 ? pagebreak:'']" v-for="(cd, index) in noofbill" :key="index">
            <div>
                <table width="100%" cellspacing="0" style="border:2px solid black;">
                    <tbody>
                        <tr class="align-top">
                            <td colspan="2" style="border-right:1px solid black;" class="pl-2">
                                <span style="font-size:30px;"> <b>{{ companyDetails.name }}</b></span>
                            </td>
                            <td style="border-left:1px solid black;" class="pl-2">
                                <b>Address: </b>{{companyDetails.address}},
                                {{companyDetails.city}}, {{companyDetails.state}} {{companyDetails.pinCode}}<br />
                                <b>Contact: </b>{{companyDetails.mobile}}
                                <br /><br /><br /><br />
                            </td>
                        </tr>
                        <tr>
                            <td style="border-top:2px solid black;border-bottom:2px solid black;" colspan="4">
                                <span style="margin-left:51%;">
                                    <b>{{companyDetails.billuppertext }}</b>
                                </span>
                                <span style="float:right;" class="pr-2">
                                    <b>Original</b>
                                </span>
                            </td>
                        </tr>
                        <tr>
                            <td width="55%" style="border-right:2px solid black;">
                                <table width="100%">
                                    <tbody>
                                        <tr>
                                            <td align="center" style="border:none;"><b> </b></td>
                                            <td colspan="4" style="border:none;"><b>{{customer.name}}</b></td>
                                        </tr>
                                        <tr>
                                            <td align="center" style="border:none;"></td>
                                            <td colspan="4" style="border:none;">{{customer.street}},</td>
                                        </tr>
                                        <tr>
                                            <td align="center" style="border:none;"></td>
                                            <td colspan="4" style="border:none;">{{customer.area}},</td>
                                        </tr>
                                        <tr>
                                            <td align="center" style="border:none;"></td>
                                            <td colspan="4" style="border:none;">
                                                <b>{{customer.city}}</b>
                                                <span style="margin-left:25%">
                                                    <b>Mob : {{customer.mobile}}</b>
                                                </span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td align="center" style="border:none;"></td>
                                            <td colspan="4" style="border:none;">
                                                <span style="margin-left:35%">
                                                    <b>Placeof Supply :</b> {{customer.statecode}}-{{customer.state}}
                                                </span>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </td>
                            <td colspan="3" style="width:45%;" class="color-tr">
                                <table width="100%" class="account_table">
                                    <tbody>
                                        <tr>
                                            <th width="20%">Invoice No.
                                            </th>
                                            <th width="4%">:</th>
                                            <th width="38%">{{billbook.prefix}}-{{order.billno}}</th>
                                            <th width="38%"></th>
                                        </tr>
                                        <tr>
                                            <th> Date </th>
                                            <th>:</th>
                                            <th>{{new
                                                Date(order.billdate).getDate()+"-"+(new
                                                Date(order.billdate).getMonth()+1)+"-"+new
                                                Date(order.billdate).getFullYear()}}</th>
                                            <th></th>
                                        </tr>
                                        <tr>
                                            <td colspan="4">&nbsp;</td>
                                        </tr>
                                        <tr>
                                            <td colspan="4">&nbsp;</td>
                                        </tr>
                                        <tr>
                                            <td colspan="4">&nbsp;</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <table class="" width="100%" cellspacing="0" style="border-bottom: 2px solid black; border-right: 2px solid black; border-left: 2px solid black;">
                    <tbody>
                        <tr>
                            <td width="5%" align="center" style="border-bottom: 1px solid black; border-right: 1px solid black; border-left: 1px solid black;"><b>SrNo</b></td>
                            <td width="40%" align="center" style="border-bottom: 1px solid black; border-right: 1px solid black; border-left: 1px solid black;"><b>Product
                                    Name</b></td>
                            <td width="10%" align="center" style="border-bottom: 1px solid black; border-right: 1px solid black; border-left: 1px solid black;"><b>HSN/SAC</b></td>
                            <td width="15%" align="center" style="border-bottom: 1px solid black; border-right: 1px solid black; border-left: 1px solid black;"><b>QTY</b></td>
                            <td width="15%" colspan="1" align="center" style="border-bottom: 1px solid black; border-right: 1px solid black; border-left: 1px solid black;"><b>Rate</b></td>
                            <td width="15%" colspan="2" align="center" style="border-left:1px solid black;border-right:2px solid black;border-bottom:1px solid black;"><b>Amount</b></td>
                        </tr>
                        <tr v-for="(value, index) in Orderitems" :key="index">
                            <td width="5%" align="center" style="border:1px solid black;">{{index+1}}</td>
                            <td width="40%" class="font-14" style="border:1px solid black;">&nbsp;{{value.item.billname}}</td>
                            <td width="10%" align="center" style="border:1px solid black;">{{value.item.hsncode}}</td>
                            <td width="15%" align="center" style="border:1px solid black;">{{value.quantity}}</td>
                            <td width="15%" colspan="1" align="center" style="border:1px solid black;">{{value.itemprice}}</td>
                            <td width="15%" colspan="2" align="right" style="border-left:1px solid black;border-right:2px solid black;border-bottom:1px solid black;border-top:1px solid black;">{{(parseFloat(value.quantity)
                                * parseFloat(value.itemprice) )}} &nbsp;</td><br /><br />
                        </tr>
                        <tr style="background-color:#aab79f;border:2px solid black;">
                            <td colspan="4" width="60%" class="px-1" style="border-right:1px solid black;border-left:1px solid black;">
                                <b>GSTIN NO.:- {{customer.gstin}}</b>
                            </td>
                            <td colspan="5" class="px-1" style="border-left:1px solid black;border-right:2px solid black;"
                                width="40%">
                                <b>Sub Total </b><span style="float:right;"><b>{{order.itemtotal - order.taxamount }} &nbsp;</b></span>
                            </td>
                        </tr>
                        <tr>
                            <td colspan="4" width="60%" style="border:1px solid black;">
                                <table class="" width="100%">
                                    <tbody>
                                        <tr style="border-bottom:2px solid black;">
                                            <td align="center"><b>Note:<br /><br /><br /></b></td>
                                        </tr>
                                        <tr style="border-bottom:2px solid black;">
                                            <td><b>Total GST : {{order.taxamount}}<br /><br /></b></td>
                                        </tr>
                                        <tr>
                                            <td><b>Bill Amount : {{amountowords}} Only<br /><br /></b></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </td>
                            <td colspan="5" width="40%" style="border:2px solid black;">
                                <table width="100%" height="100%" class="">
                                    <tbody>
                                        <tr style="border-bottom:2px solid black;margin-bottom:20px;">
                                            <td> <br /><br /><b>Taxable Amount: {{order.itemtotal - order.taxamount }}</b><br /><br /><br /><br /></td>
                                        </tr>
                                        <tr>
                                            <td height="100%" style="background-color:#aab79f;"><b>Grand Total:-
                                                    {{order.totalamount}}</b></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </td>
                        </tr>
                        <tr>
                            <td style="border:2px solid black;" class="pl-1" colspan="9">
                                <b>Terms and Conditions:-
                                    <span ref="tnc"></span>
                                </b>
                            </td>
                        </tr>
                    </tbody>
                </table><br /><br /><br />
            </div>
        </div>
    </div>
</template>
<style scoped>
    td {
        border-color: white;
    }

    table {
        color: black
    }

    .color-tr {
        background-color: #aab79f;
    }

    .account_table {
        border-collapse: collapse;
    }
</style>

<script>
    export default {
        props: {
            id: {
                type: String,
                required: false
            },
            onlyprint: {
                type: Boolean,
                required: false
            },
            noofbill: {
                type: Number,
                required: true
            },
            multiple: {
                type: Boolean,
                required: false
            },
            value: {
                type: String,
                required: false
            }
        },
        data() {
            return {
                configuration: {},
                print: 0,
                companyDetails: {

                },
                pagebreak: 'pagebreak',
                orderPayment: [],
                customer: {

                },
                order: {

                },
                amountowords: "",
                billbook: {

                },
                Orderitems: [

                ],
                transport: {
                    name: "",
                    vehicleno: ""
                },
                print: 0
            }
        },
        beforeMount() {
            if (this.id != null) {
                this.$axios.get("/" + this.$route.params.username + "/api/Orders?access_token=" + this.$store.state.token + "&filter[where][id]=" + this.id + "&filter[where][isenabled]=1")
                    .then(res => {
                        if (res.data.length > 0) {
                            this.getConfiguration()
                            this.getDetails()
                        }
                        else {
                            return this.$nuxt.error({ statusCode: 404, message: "Page Not Found" })
                        }
                    })
                    .catch(e => {
                        return this.$nuxt.error({ statusCode: e.response.status, message: e.message })
                    })
            }
        },
        updated() {
            if (this.print == 2 && this.onlyprint == true) {
                window.print()
                this.$emit('input', '');
                //this.$forceUpdate();
            }
            if (this.print == 2) {
                this.$emit('input', '');
            }
            this.print++
            //console.log("CAll")
        },
        methods: {
            getConfiguration() {
                return new Promise((resolve, reject) => {
                    this.$axios.get("/" + this.$route.params.username + "/api/Configurations?access_token=" + this.$store.state.token)
                        .then(res => {
                            for (let i = 0; i < res.data.length; i++) {
                                if (res.data[i].alias == "manage_transport") this.configuration.transport = res.data[i].value
                                else if (res.data[i].alias == "calculate_taxes_sales") this.configuration.taxes = res.data[i].value
                            }
                            resolve("done")
                        })
                })
            },
            getDetails() {
                this.$axios.get("/" + this.$route.params.username + "/api/Details?access_token=" + this.$store.state.token)
                    .then(res => {
                        this.companyDetails = res.data[0]
                        for (let i = 0; i < this.noofbill; i++)
                            this.$refs.tnc[i].innerHTML = this.companyDetails.termsandconditions
                    })
                this.$axios.get("/" + this.$route.params.username + "/api/Orders?access_token=" + this.$store.state.token + "&filter[where][id]=" + this.id + "&filter[include]=customer&filter[include]=billbook&filter[include]=transport")
                    .then(res => {
                        this.customer = res.data[0].customer
                        this.order = res.data[0]
                        this.billbook = res.data[0].billbook
                        if (res.data[0].transportId != null) {
                            this.transport = res.data[0].transport
                        }
                        this.amountowords = this.toWords(this.order.totalamount)
                    })
                this.$axios.get("/" + this.$route.params.username + "/api/Orderitems?access_token=" + this.$store.state.token + "&filter[where][orderId]=" + this.id + "&filter[order]=series&filter[include][item]=unit&filter[include][item][subType][type]=tax")
                    .then(res => {
                        this.Orderitems = res.data
                    })
                this.$axios.get("/" + this.$route.params.username + "/api/Orderpayments?access_token=" + this.$store.state.token + "&filter[where][orderId]=" + this.id)
                    .then(res => {
                        this.orderPayment = res.data
                    })
            },
            toWords(amount) {
                var words = new Array();
                words[0] = '';
                words[1] = 'One';
                words[2] = 'Two';
                words[3] = 'Three';
                words[4] = 'Four';
                words[5] = 'Five';
                words[6] = 'Six';
                words[7] = 'Seven';
                words[8] = 'Eight';
                words[9] = 'Nine';
                words[10] = 'Ten';
                words[11] = 'Eleven';
                words[12] = 'Twelve';
                words[13] = 'Thirteen';
                words[14] = 'Fourteen';
                words[15] = 'Fifteen';
                words[16] = 'Sixteen';
                words[17] = 'Seventeen';
                words[18] = 'Eighteen';
                words[19] = 'Nineteen';
                words[20] = 'Twenty';
                words[30] = 'Thirty';
                words[40] = 'Forty';
                words[50] = 'Fifty';
                words[60] = 'Sixty';
                words[70] = 'Seventy';
                words[80] = 'Eighty';
                words[90] = 'Ninety';
                amount = amount.toString();
                var atemp = amount.split(".");
                var number = atemp[0].split(",").join("");
                var n_length = number.length;
                var words_string = "";
                if (n_length <= 9) {
                    var n_array = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0);
                    var received_n_array = new Array();
                    for (var i = 0; i < n_length; i++) {
                        received_n_array[i] = number.substr(i, 1);
                    }
                    for (var i = 9 - n_length, j = 0; i < 9; i++ , j++) {
                        n_array[i] = received_n_array[j];
                    }
                    for (var i = 0, j = 1; i < 9; i++ , j++) {
                        if (i == 0 || i == 2 || i == 4 || i == 7) {
                            if (n_array[i] == 1) {
                                n_array[j] = 10 + parseInt(n_array[j]);
                                n_array[i] = 0;
                            }
                        }
                    }
                    var value = "";
                    for (var i = 0; i < 9; i++) {
                        if (i == 0 || i == 2 || i == 4 || i == 7) {
                            value = n_array[i] * 10;
                        } else {
                            value = n_array[i];
                        }
                        if (value != 0) {
                            words_string += words[value] + " ";
                        }
                        if ((i == 1 && value != 0) || (i == 0 && value != 0 && n_array[i + 1] == 0)) {
                            words_string += "Crores ";
                        }
                        if ((i == 3 && value != 0) || (i == 2 && value != 0 && n_array[i + 1] == 0)) {
                            words_string += "Lakhs ";
                        }
                        if ((i == 5 && value != 0) || (i == 4 && value != 0 && n_array[i + 1] == 0)) {
                            words_string += "Thousand ";
                        }
                        if (i == 6 && value != 0 && (n_array[i + 1] != 0 && n_array[i + 2] != 0)) {
                            words_string += "Hundred and ";
                        } else if (i == 6 && value != 0) {
                            words_string += "Hundred ";
                        }
                    }
                    words_string = words_string.split("  ").join(" ");
                }
                return words_string; return str.replace(/\s+/g, ' ');
            }
        }
    }
</script>