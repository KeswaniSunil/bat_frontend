<template>
  <v-layout row wrap>
    <v-flex xs12 text-xs-center>
      <div>
        <v-tabs v-model="tab" class="tab-display-none"  color="white" grow light>
          <v-tabs-slider color="black"></v-tabs-slider>
          <v-tab v-for="(item,index) in items" :key="index" :href="`#tab-${index+1}`">
            {{ item.name }}
          </v-tab>
        </v-tabs>
        <v-tabs-items v-model="tab" touchless>
          <v-tab-item v-for="(item,index) in items" :key="index" :value="`tab-${index+1}`">
            <v-card flat>
              <v-card-text class="body-background padding-xs">
                <!--     New Bill  -->
                <bill v-if="index == 0" class="mt-3"/>
                
                <!--  View Customer -->
                <viewCustomer v-else-if="index == 1" class="mt-3" />

                <!-- Order Listing -->
                <orderListing class="mt-3" v-else-if="index == 2" mode="sale" :startDate="startDate" :endDate="endDate" :billBookId="billBookId"/>
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
  import loadercontent from "@/components/loadercontent";
  export default {
    layout: "dashboard",
    components:{
      bill,
      viewCustomer,
      orderListing,
      loadercontent
    },
    mounted(){
      if(this.$route.hash.search("tab") > -1)
      {
        this.tab = this.$route.hash.substr(1)
      }
    },
    beforeUpdate(){
      if(this.$route.query.startDate != null && this.$route.query.endDate != null)
      {
        this.$router.push(new String(this.$route.fullPath).replace(this.$route.hash,"#"+this.tab))
      }
      else {
        this.$router.push("#"+this.tab)
      }
    },
    updated(){
      this.loading = false;
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
    beforeDestroy(){
    },
    destroyed(){
    },
    data() {
      return {
        tab: null,
        isActive: 0,
        loading:true,
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