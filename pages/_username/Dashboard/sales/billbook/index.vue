<template>
  <v-layout row wrap>
    <v-flex xs12 text-xs-center>
        <v-card flat>
            <v-card-text class="body-background">
                <viewBillbook class="mt-3" />
            </v-card-text>
        </v-card>
    </v-flex>
  </v-layout>
</template>
<script>
import viewBillbook from "@/components/sales/billbook/viewBillbook";
export default {
    layout:"dashboard",
    components:{
        viewBillbook
    },
    data() {
      return {
        
      }
    }
}
</script>
