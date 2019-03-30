<template>
    <v-card flat>
        <v-card-text class="body-background">
            <viewTransport class="mt-3"/>
        </v-card-text>
    </v-card>
</template>
<script>
import viewTransport from "~/components/transport/viewTransport";
export default {
    layout:'dashboard',
    components:{
        viewTransport
    }
}
</script>
