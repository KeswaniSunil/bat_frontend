<template>
    <v-card flat>
        <v-card-text class="body-background">
            <viewTax class="mt-3"/>
        </v-card-text>
    </v-card>
</template>
<script>
import viewTax from "~/components/tax/viewTax";
export default {
    layout:'dashboard',
    components:{
        viewTax
    }
}
</script>
