<template>
    <v-layout row wrap>
        <v-flex xs12 text-xs-center>
            <v-card class="body-background">
                <v-card-text >
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