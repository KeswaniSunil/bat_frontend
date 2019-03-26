<template>
  <v-layout row wrap>
    <v-flex xs12 text-xs-center>
      <div>
        <v-tabs v-model="tab" color="grey lighten-2" grow light>
          <v-tabs-slider color="black"></v-tabs-slider>
          <v-tab v-for="(item,index) in items" :key="index">
            {{ item.name }}
          </v-tab>
        </v-tabs>
        <v-tabs-items v-model="tab">
          <v-tab-item v-for="(item,index) in items" :key="index">
            <v-card flat>
              <v-card-text class="grey lighten-3">
                <!--     New Bill  -->
                <bill v-if="index == 0" />
                
                <!--  View Customer -->
                <viewCustomer v-else-if="index == 1" />

                <!-- Order Listing -->
                <orderListing v-else-if="index == 2" mode="sale" :startDate="startDate" :endDate="endDate" :billBookId="billBookId"/>
              </v-card-text>
            </v-card>
          </v-tab-item>
        </v-tabs-items>
      </div>
    </v-flex>
  </v-layout>
</template>
<script>
  import bill from "@/components/sales/bill";
  import viewCustomer from "@/components/sales/viewCustomer";
  import orderListing from '@/components/orderListingComponent';
  export default {
    components:{
      bill,
      viewCustomer,
      orderListing
    },
    created(){
        if(this.$route.query.startDate != null && this.$route.query.endDate != null || this.$route.query.id != null)
        {
            this.startDate = this.$route.query.startDate
            this.endDate = this.$route.query.endDate
            this.billBookId = this.$route.query.id
        }
        else {
            let date=new Date();
            let month=date.getMonth();
            let year=date.getFullYear();
            let date1=""+new Date(year, month+1, 0).getDate();
            let date2=""+new Date(year, month, 1).getDate();
            if((date.getMonth()+1) < 10) month="0"+(date.getMonth()+1)
            if(date2 <10) date2="0"+date2;
            this.startDate=year+"-"+month+"-"+date2;
            this.endDate=year+"-"+month+"-"+date1;
        }
    },
    data() {
      return {
        tab: null,
        isActive: 0,
        notactive: 'red red--text text--lighten-4',
        active: 'red white--text',
        items: [
          { name:'New Bill' },
          { name: 'Customers' },
          { name: 'Order Listing'}
        ],
        startDate: null,
        endDate: null,
        billBookId: null
      }
    }
  }
</script>
<style>
</style>