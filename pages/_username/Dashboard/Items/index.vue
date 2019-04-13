<template>
  <v-layout row wrap>
    <v-flex xs12 text-xs-center>
      <div>
        <v-tabs v-model="tab" color="white" grow light>
          <v-tabs-slider color="black"></v-tabs-slider>
          <v-tab v-for="(item,index) in items" :key="index" :href="`#tab-${index+1}`">
            {{ item.name }}
          </v-tab>
        </v-tabs>
        <v-tabs-items v-model="tab" touchless>
          <v-tab-item v-for="(item,index) in items" :key="index" :value="`tab-${index+1}`">
            <v-card flat>
              <v-card-text class="body-background">
                <!--     New Bill  -->
                <ItemListing v-if="index == 0" class="mt-3" />
                <Type v-else-if="index == 1" class="mt-3" />
                <SubType v-else-if="index == 2" class="mt-3" />
              
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
    layout: "dashboard",
    components:{
      ItemListing,Type,SubType
    },
    mounted(){
      if(this.$route.hash.search("tab") > -1)
      {
        this.tab = this.$route.hash.substr(1)
      }
    },
    beforeUpdate(){
      this.$router.push("#"+this.tab)
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