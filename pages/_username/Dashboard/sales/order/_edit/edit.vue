<template>
    <v-card>
        <v-card-text class="body-background padding-xs">
            <bill :id="$route.params.edit" />
        </v-card-text>
    </v-card>
</template>

<script>
import bill from "~/components/sales/bill";
export default {
    layout: "dashboard",
    components:{
       bill
    }
}
</script>