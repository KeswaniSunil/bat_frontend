<template>
  <div style="width:100%;color:black;padding-top:10px;">
    <div :class="[Orderitems.length > 5 ? pagebreak:'']" v-for="(cd, index) in noofbill" :key="index">
      <table border="1" width="100%" cellspacing="0" style="">
        <tbody>
          <tr style="border:none;">
            <td colspan="2">
              <center class="text-uppercase">{{ companyDetails.billuppertext }}</center>
            </td>
          </tr>
          <tr>
            <!-- row1 -->
            <td colspan="2">

              <div style="float:left;width:50%;padding-left:10px">
                <b style="font-size:25px;">{{ companyDetails.name }}</b><br />
                <b style="font-size:15px;">

                </b> <br />
                <b v-if="orderPayment.length > 0" style="font-size:15px;">Cash Bill</b>
                <b v-else style="font-size:15px;">Credit Bill</b> <br />
              </div>
              <div style="float:right;text-align:left;font-style:italic;font-weight: 100;width:40%;">
                <br />
                <b>Address: </b>{{companyDetails.address}}, {{companyDetails.city}}, {{companyDetails.state}}
                {{companyDetails.pinCode}}<br />
                <b>Contact: </b>{{companyDetails.mobile}}
              </div>
            </td>

            <!-- <td></td> -->
          </tr>

          <tr>
            <!-- row6 -->
            <td>Details of Receiver /Billed To</td>
            <td>Details of Bill</td>
          </tr>
          <tr>
            <!-- row7 -->
            <td rowspan="4">
              Name: {{customer.name}}<br />
              Address: {{customer.area}}, {{customer.street}}, {{customer.city}}, {{customer.state}}
              {{customer.pincode}}<br />
              Mobile no: {{customer.mobile}}<br />
              GSTIN/UIN: {{customer.gstin}}<br />
              State: {{customer.state}}<br />
              State Code: {{customer.statecode}}
            </td>
            <td rowspan="4">
              Bill No.: <span class="text-uppercase">{{billbook.prefix}}</span>{{order.billno}}<br />
              GSTN : {{companyDetails.gstin}}<br />
              Date Of Issue: {{new Date(order.billdate).getDate()+"-"+(new Date(order.billdate).getMonth()+1)+"-"+new
              Date(order.billdate).getFullYear()}}<br />
              State: {{companyDetails.state}}<br />
              State Code: {{companyDetails.statecode}}
            </td>
          </tr>
          <tr>
            <!-- row8 -->
            <!-- <td></td>
          <td></td> -->
          </tr>
          <tr>
            <!-- row9 -->
            <!-- <td></td>
          <td></td> -->
          </tr>
          <tr>
            <!-- row10 -->
            <!-- <td></td>
          <td></td> -->
          </tr>
          <tr>
            <!-- roww11 -->
            <!-- <td></td>
          <td></td> -->
          </tr>
        </tbody>
      </table>
      <table border="1" width="100%" cellspacing="0">
        <!-- <tr>
          <td colspan="10"><br /></td>
        </tr> -->

        <tbody>
          <tr>
            <td width=" 2%"><b>No.</b> </td>
            <td width="35%"><b>Description of Product/Service</b></td>
            <td width="5%"><b>HSN</b></td>

            <td width="5%"><b>QTY</b></td>
            <td width="3%"><b>Unit</b></td>
            <td width="5%"><b>Rate</b></td>

            <td v-if="configuration.taxes == 1" width="5%"><b>Taxable Amt</b></td>
            <td v-if="configuration.taxes == 1" width="5%"><b>SGST</b></td>
            <td v-if="configuration.taxes == 1" width="5%"><b>CGST</b></td>
            <td v-if="configuration.taxes == 1" width="5%"><b>IGST</b></td>
            <td width="10%"><b>Total Amt</b></td>
          </tr>
          <tr v-for="(value, index) in Orderitems" :key="index">
            <td width=" 2%">{{index+1}}</td>
            <td width="35%">{{value.item.billname}}</td>
            <td width="5%">{{value.item.hsncode}}</td>
            <td width="5%">{{value.quantity}}</td>
            <td width="3%">{{value.item.unit.title}}</td>
            <td width="5%">{{value.itemprice}}</td>
            <td v-if="configuration.taxes == 1" width="5%">{{value.itemprice}}</td>
            <td v-if="configuration.taxes == 1" width="5%">{{value.taxprice/2}}<br />({{value.item.subType.type.tax.percentage/2}}%)
            </td>
            <td v-if="configuration.taxes == 1" width="5%">{{value.taxprice/2}}<br />({{value.item.subType.type.tax.percentage/2}}%)
            </td>
            <td v-if="configuration.taxes == 1" width="5%">- </td>
            <td width="10%">{{(parseFloat(value.quantity) * parseFloat(value.itemprice) ) +
              parseFloat(value.taxprice)}}</td>
          </tr>
          <tr>
            <td colspan="2"> Total (Rs)</td>
            <td v-if="configuration.taxes == 1" colspan="8"> </td>
            <td v-else colspan="4"> </td>
            <td width="10%">{{order.itemtotal}}</td>
          </tr>
        </tbody>
      </table>
      <table border="1" width="100%" cellspacing="0">
        <!-- <tr>
          <td colspan="3">Total Invoice Amount in Words:<b>
            </b>
          </td>
        </tr> -->
        <tbody>
          <tr>
            <td rowspan="3" width="50%">
              <b>: Bank Detail :</b><br />
              <li>Bank Name: {{companyDetails.bankaccountname}}</li>

              <li>Bank Account No: {{companyDetails.bankaccountno}}</li>

              <li>Bank IFSC CODE: {{companyDetails.bankifsc}}</li>
            </td>
            <td rowspan="3" width="50%" style="padding: 0px;vertical-align: bottom;">

              <table border="1" cellpadding="0" cellspacing="0" width="100%">
                <tbody>
                  <tr>
                    <td>
                      Basic Amount
                    </td>
                    <td>
                      Rs {{parseFloat(order.itemtotal) - parseFloat(order.taxamount)}} </td>
                  </tr>

                  <tr v-if="configuration.taxes == 1">
                    <td>Add: CGST </td>
                    <td> Rs {{parseFloat(order.taxamount) / 2}}</td>

                  </tr>
                  <tr v-if="configuration.taxes == 1">
                    <td>Add: SGST </td>
                    <td> Rs {{parseFloat(order.taxamount) / 2}}</td>

                  </tr>
                  <tr v-if="configuration.taxes == 1">
                    <td>Add: IGST </td>
                    <td> - </td>

                  </tr>
                  <tr>
                    <td>Add: Charges </td>
                    <td>{{order.charges}}</td>

                  </tr>
                  <tr>
                    <td>Sub: Discount </td>
                    <td v-if="new String(order.discount).indexOf('%') > -1">{{parseFloat(order.itemtotal *
                      parseFloat(order.discount.toString().substr(0,order.discount.toString().length - 1)) / 100)}}
                      ({{order.discount}})</td>
                    <td v-else>{{order.discount}}</td>
                  </tr>
                  <tr>
                    <td>Roundoff </td>
                    <td>{{order.roundoff}}</td>

                  </tr>
                  <!-- <tr>
                  <td>Total GST/TAX Amount  </td>
                  <td>Rs 2.5</td>

              </tr> -->

                  <tr>
                    <td>
                      Total Amount After Tax
                    </td>
                    <td>
                      Rs {{parseFloat(order.totalamount)}} </td>
                  </tr>
                </tbody>
              </table>

            </td>
          </tr>
          <tr>
            <!-- <td></td>
          <td></td>
          <td></td> -->
          </tr>
          <tr>
            <!-- <td></td>
          <td></td>
          <td></td> -->
          </tr>
          <tr>
            <!-- <td></td>
          <td></td>
          <td></td> -->
          </tr>
          <tr>
            <td rowspan="4">
              <b> Transport Details </b>
              <br />
              <li>Transport : {{transport.name}}</li>
              <li>Vehicle No : {{transport.vehicleno}}</li>
              <li>Date of Supply: {{new Date(order.dateofsupply).getDate()+"-"+(new
                Date(order.dateofsupply).getMonth()+1)+"-"+new Date(order.dateofsupply).getFullYear()}}</li>
              <li>Place of Supply : {{order.placeofsupply}}</li>


            </td>
            <!-- <td></td> -->
            <td rowspan="4">
              <b>: Terms and Conditions :</b><br />

              <span ref="tnc"></span> <br /><br />
              <center>Cetified that the particular given above are true and correct</center>
              <center>For,</center><br /><br />
              <center>Authorised Signatory</center>
            </td>
          </tr>
          <tr>
            <!-- <td ></td> -->
            <!-- <td></td> -->
            <!-- <td></td> -->
          </tr>
          <tr>
            <!-- 		<td ></td> -->
            <!-- <td></td> -->
            <!-- <td></td> -->
          </tr>
          <tr>
            <!-- <td ></td> -->
            <!-- <td></td> -->
            <!-- <td></td> -->
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<style scoped>
  th,
  td {
    padding-left: 5px;
    font-size: 12px;
  }

  table {
    border-color: #7dd1f9;
    /*color: #04aeff;*/
    font-size: 12px;
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
        companyDetails: {

        },
        orderPayment: [],
        pagebreak: 'pagebreak',
        customer: {

        },
        order: {

        },
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
    created() {
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
      if(this.print == 2){
          this.$emit('input', '');
      }
      this.print++
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
            this.$refs.tnc.innerHTML = this.companyDetails.termsandconditions
          })
        this.$axios.get("/" + this.$route.params.username + "/api/Orders?access_token=" + this.$store.state.token + "&filter[where][id]=" + this.id + "&filter[include]=customer&filter[include]=billbook&filter[include]=transport")
          .then(res => {
            this.customer = res.data[0].customer
            this.order = res.data[0]
            this.billbook = res.data[0].billbook
            if (res.data[0].transportId != null) {
              this.transport = res.data[0].transport
            }
          })
        this.$axios.get("/" + this.$route.params.username + "/api/Orderitems?access_token=" + this.$store.state.token + "&filter[where][orderId]=" + this.id + "&filter[order]=series&filter[include][item]=unit&filter[include][item][subType][type]=tax")
          .then(res => {
            this.Orderitems = res.data
          })
        this.$axios.get("/" + this.$route.params.username + "/api/Orderpayments?access_token=" + this.$store.state.token + "&filter[where][orderId]=" + this.id)
          .then(res => {
            this.orderPayment = res.data
          })
      }
    }
  }
</script>