<template>
    <bill :id="$route.params.edit" />
</template>

<script>
import bill from "~/components/purchase/bill";
export default {
    components:{
       bill
    }
}
</script>