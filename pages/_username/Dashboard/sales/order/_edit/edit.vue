<template>
    <bill :id="$route.params.edit" />
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