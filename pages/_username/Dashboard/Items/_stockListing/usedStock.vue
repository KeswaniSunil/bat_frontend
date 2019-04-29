<template>
    <v-layout row wrap>
        <v-flex xs12 text-xs-center>
            <v-card class="elevation-0">
                <v-card-text class="body-background padding-xs">
                        <stockListing mode="used"/>        
                </v-card-text>
            </v-card>
        </v-flex>
    </v-layout>
</template>
<script>
import stockListing from "~/components/Items/viewStockListing.vue"
export default {
    layout:"dashboard",
    components:{
        stockListing
    }
}
</script>