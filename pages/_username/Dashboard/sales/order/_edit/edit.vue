<template>
    <bill :id="$route.params.edit" />
</template>

<script>
import bill from "~/components/sales/bill";
export default {
    components:{
       bill
    }
}
</script>