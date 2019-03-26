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
                <ItemListing v-if="index == 0" />
                <Type v-else-if="index == 1" />
                <SubType v-else-if="index == 2" />
              
              </v-card-text>
            </v-card>
          </v-tab-item>
        </v-tabs-items>
      </div>
    </v-flex>
  </v-layout>
</template>
<script>
  import ItemListing from "@/components/Items/viewItemListing";
  import Type from "@/components/Items/viewType";
  import SubType from "@/components/Items/viewSubType";
  export default {
    components:{
      ItemListing,Type,SubType
    },
    data() {
      return {
        tab: null,
        isActive: 0,
        notactive: 'red red--text text--lighten-4',
        active: 'red white--text',
        items: [
          { name:'Item Listing' },
          { name: 'Type' },
          { name:'SubType' }
        ]
      }
    },
    methods:{
        
    }
  }
</script>
<style>
</style>