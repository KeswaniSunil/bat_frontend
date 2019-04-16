<template>
    <v-card>
        <v-card-text class="body-background padding-xs">    
            <bill :id="$route.params.edit" class="mt-3"/>
        </v-card-text>
    </v-card>
</template>

<script>
import bill from "~/components/purchase/bill";
export default {
    layout: "dashboard",
    components:{
       bill
    }
}
</script>